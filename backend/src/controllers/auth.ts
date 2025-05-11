import { privy, supabase } from "../config";
import { RequestHandler } from "express";

interface PrivyWallet {
  address: string;
  type: "wallet";
  chainType: "ethereum" | "solana";
}

interface PrivyUser {
  id: string;
  email?: {
    address: string;
  };
  linkedAccounts: Array<PrivyWallet | { type: string; address: string }>;
}

// Store new user data from Privy into Supabase
const handleNewUser: RequestHandler = async (req, res) => {
    try {
        const user = req.user as { id: string };
        const privyUser = await privy.getUserById(user.id) as PrivyUser;

        // Find Ethereum and Solana wallets using type guards
        const solanaWallet = privyUser.linkedAccounts.find(
            (account): account is PrivyWallet => 
            'chainType' in account && account.type === "wallet" && account.chainType === "solana"
        )?.address;

        const ethereumWallet = privyUser.linkedAccounts.find(
            (account): account is PrivyWallet => 
            'chainType' in account && account.type === "wallet" && account.chainType === "ethereum"
        )?.address;

        // Store in the database
        const { data, error } = await supabase.from("users").upsert({
            privy_id: privyUser.id,
            email: privyUser.email?.address,
            ethereum_wallet: ethereumWallet,
            solana_wallet: solanaWallet,
        }, {
            onConflict: 'privy_id'
        });

        if (error) {
            console.log("Error storing user:", error);
            res.status(500).json({ error: "Failed to store user data" });
            return;
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error("Error in auth endpoint:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleMe: RequestHandler = async (req, res) => {
    try {
        const user = req.user as { id: string };
        const privyUser = await privy.getUserById(user.id) as PrivyUser;

        const { data, error } = await supabase
        .from("users")
        .select(`
            *,
            user_domains(
            id,
            token_balance,
            joined_at,
            domain:domains(
                id,
                name,
                description
            )
            )
        `)
        .eq("privy_id", privyUser.id);

        if (error) {
            console.log("Error fetching user:", error);
            res.status(500).json({ error: "Failed to fetch user data" });
            return;
        }

        if (data.length === 0) {
            // User not found, create a new user
            // Find Ethereum and Solana wallets using type guards
            const solanaWallet = privyUser.linkedAccounts.find(
                (account): account is PrivyWallet => 
                'chainType' in account && account.type === "wallet" && account.chainType === "solana"
            )?.address;

            const ethereumWallet = privyUser.linkedAccounts.find(
                (account): account is PrivyWallet => 
                'chainType' in account && account.type === "wallet" && account.chainType === "ethereum"
            )?.address;

            // Store in the database
            const { error: createError } = await supabase.from("users").upsert({
                privy_id: privyUser.id,
                email: privyUser.email?.address,
                ethereum_wallet: ethereumWallet,
                solana_wallet: solanaWallet,
            }, {
                onConflict: 'privy_id'
            });

            if (createError) {
                console.log("Error storing user:", createError);
                res.status(500).json({ error: "Failed to store user data" });
                return;
            }

            // Fetch the newly created user
            const { data: newUserData, error: fetchError } = await supabase
            .from("users")
            .select(`
                *,
                user_domains(
                id,
                token_balance,
                joined_at,
                domain:domains(
                    id,
                    name,
                    description
                )
                )
            `)
            .eq("privy_id", privyUser.id);

            if (fetchError || !newUserData || newUserData.length === 0) {
                console.log("Error fetching new user:", fetchError);
                res.status(500).json({ error: "Failed to fetch new user data" });
                return;
            }

            res.json({ success: true, data: newUserData });
            return;
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error("Error in auth endpoint:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


export {
    handleNewUser,
    handleMe
};