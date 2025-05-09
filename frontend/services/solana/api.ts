import { connection, findProgramAuthorityPDA, getProgram } from '@/utils/solana';
import { 
  buildInitializeTransaction,
  buildCreateDomainTransaction,
  buildRegisterUserTransaction,
  buildAddDomainToUserTransaction
} from './transactions';

/**
 * Initialize the program
 * @param privyWallet - Privy wallet
 */
export async function initializeProgram(privyWallet: any) {
    const transaction = await buildInitializeTransaction(privyWallet.address);
    const signature = await privyWallet.sendTransaction({
      transaction: transaction,
      connection: connection,
    });

    const confirmation = await connection.confirmTransaction(signature.signature);
    
    return { 
      success: true, 
      signature, 
      confirmation 
    };
}

export async function isWalletProgramAuthority(walletAddress: string): Promise<string> {
    const programAuthorityPDA = await findProgramAuthorityPDA();
    
    const program = await getProgram({ address: walletAddress });
    // @ts-ignore
    const authorityAccount = await program.account.programAuthority.fetch(programAuthorityPDA);
    
    return authorityAccount.authority.toString();
}

/**
 * Create a domain on-chain
 * @param privyWallet - Privy wallet
 * @param domainName - Name of the domain
 * @param description - Description of the domain
 */
export async function createDomainOnChain(privyWallet: any, domainName: string, description: string) {
  try {
    const { transaction, domainAddress } = 
      await buildCreateDomainTransaction(privyWallet.address, domainName, description);
    
    // Send the transaction using Privy
    const signature = await privyWallet.sendTransaction({
      transaction: transaction,
      connection: connection,  
    });

    console.log("Signature", signature);
    
    return { 
      success: true, 
      signature: signature.signature, 
      domainAddress,
    };
  } catch (error: any) {
    console.error("Error creating domain:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Register a user on-chain
 * @param privyWallet - Privy wallet
 * @param name - User's name
 * @param dateOfBirth - User's date of birth as Date object
 * @param email - User's email
 */
export async function registerUser(privyWallet: any, name: string, dateOfBirth: Date, email: string) {
  try {
    // Build transaction
    const { transaction, userAddress, userKeypair } = 
      await buildRegisterUserTransaction(privyWallet.address, name, dateOfBirth, email);
    
    const signature = await privyWallet.sendTransaction({
      transaction: transaction,
    });
    
    const confirmation = await connection.confirmTransaction(signature);
    
    return { 
      success: true, 
      signature, 
      userAddress,
      confirmation 
    };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Add domain to user on-chain
 * @param privyWallet - Privy wallet
 * @param userAddress - User's account address
 * @param domainAddress - Domain's account address
 * @param domainName - Name of the domain
 */
export async function addDomainToUser(privyWallet: any, userAddress: string, domainAddress: string, domainName: string) {
  try {
    const { transaction } = await buildAddDomainToUserTransaction(
      privyWallet.address,
      userAddress,
      domainAddress,
      domainName
    );
    
    const signature = await privyWallet.sendTransaction({
      transaction: transaction,
    });
    
    const confirmation = await connection.confirmTransaction(signature);
    
    return { 
      success: true, 
      signature, 
      confirmation 
    };
  } catch (error: any) {
    console.error("Error adding domain to user:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export async function getAllDomains(walletAddress: string) {

    const program = await getProgram({ address: walletAddress });

    // Get all domain accounts
    // @ts-ignore - TypeScript might complain about program.account.domain
    const allDomains = await program.account.domain.all();
    
    // Transform the data for easier consumption
    const domains = allDomains.map((item: any) => {
      const account = item.account;
      return {
        publicKey: item.publicKey.toString(),
        name: account.name,
        description: account.description,
        authority: account.authority.toString(),
      };
    });
    
    return { 
      success: true, 
      domains
    };
}