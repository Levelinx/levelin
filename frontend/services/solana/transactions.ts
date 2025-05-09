import { connection, getProgram, findProgramAuthorityPDA } from '@/utils/solana';
import { 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  Keypair
} from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

/**
 * Build an initialize transaction
 * @param walletPublicKey - Wallet's public key as string
 */
export async function buildInitializeTransaction(walletPublicKey: string) {
    const program = await getProgram({ address: walletPublicKey });
    const programAuthorityPDA = await findProgramAuthorityPDA();
    const publicKey = new PublicKey(walletPublicKey);

    const ix = await program.methods.initialize()
      .accounts({
        programAuthority: programAuthorityPDA,
        authority: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    
    const transaction = new Transaction();
    transaction.add(ix);
    
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
    transaction.feePayer = publicKey;
    
    return transaction;
}

/**
 * Build a create domain transaction
 * @param walletPublicKey - Wallet's public key as string
 * @param domainName - Name of the domain to create
 * @param description - Description of the domain
 */
// transactions.ts - Update this function
export async function buildCreateDomainTransaction(
    walletPublicKey: string, 
    domainName: string, 
    description: string
  ) {
    try {
      const program = await getProgram({ address: walletPublicKey });
      const programAuthorityPDA = await findProgramAuthorityPDA();
      const publicKey = new PublicKey(walletPublicKey);
      
      // Generate a new keypair for the domain account
      const domainKeypair = Keypair.generate();
      
      // Build instruction
      const ix = await program.methods.createDomain(domainName, description)
        .accounts({
          domain: domainKeypair.publicKey,
          programAuthority: programAuthorityPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      
      // Create a new transaction and add the instruction
      const transaction = new Transaction();
      transaction.add(ix);
      
      // Get a recent blockhash and set it on the transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      
      // Set the fee payer
      transaction.feePayer = publicKey;
      
      // Need to sign with the domain keypair
      transaction.partialSign(domainKeypair);
      
      // Store the domain keypair - ideally this would be handled more securely
      // For testing, you can use localStorage, but this isn't recommended for production
      localStorage.setItem(`domain_keypair_${domainName}`, 
        JSON.stringify(Array.from(domainKeypair.secretKey))
      );
      
      return {
        transaction,
        domainAddress: domainKeypair.publicKey.toString(),
        domainKeypair
      };
    } catch (error) {
      console.error("Error building create domain transaction:", error);
      throw error;
    }
  }

/**
 * Build a register user transaction
 */
export async function buildRegisterUserTransaction(
  walletPublicKey: string,
  name: string,
  dateOfBirth: Date,
  email: string
) {
  try {
    const program = await getProgram({ address: walletPublicKey });
    const publicKey = new PublicKey(walletPublicKey);
    
    // Generate a new keypair for the user account
    const userKeypair = Keypair.generate();
    
    // Convert date to unix timestamp
    const dateOfBirthTimestamp = new BN(Math.floor(dateOfBirth.getTime() / 1000));
    
    // Build instruction
    const ix = await program.methods.registerUser(name, dateOfBirthTimestamp, email)
      .accounts({
        user: userKeypair.publicKey,
        authority: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    
    const transaction = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;
    
    // Need to sign with the user keypair
    transaction.partialSign(userKeypair);
    
    return {
      transaction,
      userAddress: userKeypair.publicKey.toString(),
      userKeypair
    };
  } catch (error) {
    console.error("Error building register user transaction:", error);
    throw error;
  }
}

/**
 * Build an add domain to user transaction
 */
export async function buildAddDomainToUserTransaction(
  walletPublicKey: string,
  userAddress: string,
  domainAddress: string,
  domainName: string
) {
  try {
    const program = await getProgram({ address: walletPublicKey });
    const publicKey = new PublicKey(walletPublicKey);
    
    const ix = await program.methods.addDomainToUser(domainName)
      .accounts({
        user: new PublicKey(userAddress),
        domain: new PublicKey(domainAddress),
        authority: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    
    const transaction = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;
    
    return { transaction };
  } catch (error) {
    console.error("Error building add domain to user transaction:", error);
    throw error;
  }
}