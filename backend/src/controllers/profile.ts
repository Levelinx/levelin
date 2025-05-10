import { Request, Response } from "express";
import { supabase } from "../config";
import { ProfileSchema } from "../schemas/profile";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("privy_id", req.user.privyId)
            .single();

        if (error) throw error;

        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const getRandomProfiles = async (req: Request, res: Response) => {
    try {
        // First get the user's UUID from privy_id
        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("privy_id", req.user.privyId)
            .single();

        if (userError) throw userError;

        const { data: profiles, error } = await supabase
            .from("users")
            .select("*")
            .neq("id", currentUser.id)
            .limit(5);

        if (error) throw error;

        res.json(profiles);
    } catch (error) {
        console.error("Error fetching random profiles:", error);
        res.status(500).json({ error: "Failed to fetch random profiles" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, bio, avatar_url, date_of_birth } = req.body;

        const { data: profile, error } = await supabase
            .from("users")
            .update({
                name,
                bio,
                avatar_url,
                date_of_birth,
                updated_at: new Date().toISOString(),
            })
            .eq("privy_id", req.user.id)
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        res.json(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const getUploadUrl = async (req: Request, res: Response) => {
    try {
        const { fileType } = req.body;
        const fileExt = fileType.split("/")[1];
        
        // Get user's UUID from privy_id
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("privy_id", req.user.id)
            .single();

        if (userError) throw userError;

        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from("objects")
            .createSignedUploadUrl(fileName);

        if (error) throw error;

        res.json({
            uploadUrl: data.signedUrl,
            path: data.path,
        });
    } catch (error) {
        console.error("Error getting upload URL:", error);
        res.status(500).json({ error: "Failed to get upload URL" });
    }
};

export const searchProfiles = async (req: Request, res: Response) => {
    try {
        const { search, cursor, limit = 10 } = req.query;
        
        let query = supabase
            .from("users")
            .select("*", { count: 'exact' })
            .ilike("name", `%${search}%`)
            .order("name", { ascending: true })
            .limit(Number(limit));

        if (cursor) {
            query = query.gt("name", cursor);
        }

        const { data: profiles, error, count } = await query;

        if (error) throw error;

        res.json({
            data: profiles,
            count,
            nextCursor: profiles.length > 0 ? profiles[profiles.length - 1].name : null
        });
    } catch (error) {
        console.error("Error searching profiles:", error);
        res.status(500).json({ error: "Failed to search profiles" });
    }
}; 