import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { expect } from "chai";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";

describe("decentralized-proof-of-work", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.contract as Program<Contract>;
  const provider = anchor.getProvider();
  
  // Define keypairs for accounts
  const userAccount = Keypair.generate();
  const domainAccount = Keypair.generate();
  const challengeAccount = Keypair.generate();
  
  // Program authority PDA
  let programAuthorityPda: PublicKey;
  let programAuthorityBump: number;
  
  // Test data
  const userName = "John Doe";
  const userEmail = "john@example.com";
  const dateOfBirth = new anchor.BN(946684800); // 2000-01-01
  
  const domainName = "Software Engineering";
  const domainDescription = "Development of software applications and systems";
  
  const challengeDescription = "Build a ToDo app using React";
  const tokenFee = new anchor.BN(50);
  const oneWeekFromNow = new anchor.BN(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);
  
  before(async () => {
    // Calculate the PDA for program authority
    const [pda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("PROGRAM_AUTHORITY")],
      program.programId
    );
    programAuthorityPda = pda;
    programAuthorityBump = bump;
    
    // Airdrop some SOL to the user account for transaction fees
    const signature = await provider.connection.requestAirdrop(
      userAccount.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    // Also airdrop to the wallet
    const signature2 = await provider.connection.requestAirdrop(
      provider.wallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature2);
  });

  it("Initializes the program", async () => {
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          // @ts-ignore
          programAuthority: programAuthorityPda,
          authority: provider.wallet.publicKey,
          // @ts-ignore
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log("Initialize transaction signature", tx);
      
      // Fetch the program authority to confirm it was set correctly
      const programAuthority = await program.account.programAuthority.fetch(
        programAuthorityPda
      );
      expect(programAuthority.authority.toString()).to.equal(
        provider.wallet.publicKey.toString()
      );
      expect(programAuthority.isInitialized).to.equal(true);
    } catch (error) {
      console.error("Error in initialize:", error);
      throw error;
    }
  });

  it("Registers a new user", async () => {
    try {
      const tx = await program.methods
        .registerUser(userName, dateOfBirth, userEmail)
        .accounts({
          user: userAccount.publicKey,
          authority: provider.wallet.publicKey,
          // @ts-ignore
          systemProgram: SystemProgram.programId,
        })
        .signers([userAccount])
        .rpc();
      
      console.log("Register user transaction signature", tx);
      
      // Fetch the user account to confirm it was created correctly
      const user = await program.account.user.fetch(userAccount.publicKey);
      expect(user.name).to.equal(userName);
      expect(user.email).to.equal(userEmail);
      expect(user.dateOfBirth.toString()).to.equal(dateOfBirth.toString());
      expect(user.domains.length).to.equal(0);
    } catch (error) {
      console.error("Error in register user:", error);
      throw error;
    }
  });
  
  it("Updates user information", async () => {
    try {
      const newName = "John Updated";
      const newEmail = "updated@example.com";
      
      const tx = await program.methods
        .updateUser(newName, dateOfBirth, newEmail)
        .accounts({
          user: userAccount.publicKey,
          authority: provider.wallet.publicKey,
        })
        .rpc();
      
      console.log("Update user transaction signature", tx);
      
      // Fetch the user account to confirm it was updated correctly
      const user = await program.account.user.fetch(userAccount.publicKey);
      expect(user.name).to.equal(newName);
      expect(user.email).to.equal(newEmail);
    } catch (error) {
      console.error("Error in update user:", error);
      throw error;
    }
  });
  
  it("Creates a new domain", async () => {
    try {
      const tx = await program.methods
        .createDomain(domainName, domainDescription)
        .accounts({
          domain: domainAccount.publicKey,
          programAuthority: programAuthorityPda,
          authority: provider.wallet.publicKey,
          // @ts-ignore
          systemProgram: SystemProgram.programId,
        })
        .signers([domainAccount])
        .rpc();
      
      console.log("Create domain transaction signature", tx);
      
      // Fetch the domain account to confirm it was created correctly
      const domain = await program.account.domain.fetch(domainAccount.publicKey);
      expect(domain.name).to.equal(domainName);
      expect(domain.description).to.equal(domainDescription);
      expect(domain.authority.toString()).to.equal(provider.wallet.publicKey.toString());
    } catch (error) {
      console.error("Error in create domain:", error);
      throw error;
    }
  });
  
  it("Adds domain to user", async () => {
    try {
      const tx = await program.methods
        .addDomainToUser(domainName)
        .accounts({
          user: userAccount.publicKey,
          domain: domainAccount.publicKey,
          authority: provider.wallet.publicKey,
        })
        .rpc();
      
      console.log("Add domain to user transaction signature", tx);
      
      // Fetch the user account to confirm the domain was added
      const user = await program.account.user.fetch(userAccount.publicKey);
      expect(user.domains.length).to.equal(1);
      expect(user.domains[0].name).to.equal(domainName);
      expect(user.domains[0].tokenBalance.toNumber()).to.equal(100);
    } catch (error) {
      console.error("Error in add domain to user:", error);
      throw error;
    }
  });
  
  it("Creates a challenge and automatically assigns user as challenger", async () => {
    try {
      const tx = await program.methods
        .createChallenge(
          domainName,
          challengeDescription,
          tokenFee,
          oneWeekFromNow
        )
        .accounts({
          challenge: challengeAccount.publicKey,
          domain: domainAccount.publicKey,
          user: userAccount.publicKey,
          authority: provider.wallet.publicKey,
          // @ts-ignore
          systemProgram: SystemProgram.programId,
        })
        .signers([challengeAccount])
        .rpc();
      
      console.log("Create challenge transaction signature", tx);
      
      // Fetch the challenge account to confirm it was created correctly
      const challenge = await program.account.challenge.fetch(challengeAccount.publicKey);
      expect(challenge.domain).to.equal(domainName);
      expect(challenge.description).to.equal(challengeDescription);
      expect(challenge.tokenFee.toNumber()).to.equal(tokenFee.toNumber());
      expect(challenge.deadline.toString()).to.equal(oneWeekFromNow.toString());
      
      // Check that the challenger is automatically set
      if (challenge.challenger) {
        expect(challenge.challenger.toString()).to.equal(provider.wallet.publicKey.toString());
      } else {
        throw new Error("Challenger was not set properly");
      }
      
      expect(challenge.submissionUrl).to.equal(null);
      expect(challenge.reviews.length).to.equal(0);
      expect(challenge.isCompleted).to.equal(false);
      expect(challenge.isFinalized).to.equal(false);
      
      // Fetch the user account to confirm tokens were deducted during challenge creation
      const user = await program.account.user.fetch(userAccount.publicKey);
      expect(user.domains[0].tokenBalance.toNumber()).to.equal(100 - tokenFee.toNumber());
    } catch (error) {
      console.error("Error in create challenge:", error);
      throw error;
    }
  });
  
  it("Submits a challenge", async () => {
    try {
      const submissionUrl = "https://github.com/johndoe/todo-app";
      
      const tx = await program.methods
        .submitChallenge(submissionUrl)
        .accounts({
          challenge: challengeAccount.publicKey,
          user: userAccount.publicKey,
          authority: provider.wallet.publicKey,
        })
        .rpc();
      
      console.log("Submit challenge transaction signature", tx);
      
      // Fetch the challenge account to confirm the submission
      const challenge = await program.account.challenge.fetch(challengeAccount.publicKey);
      if (challenge.submissionUrl) {
        expect(challenge.submissionUrl).to.equal(submissionUrl);
      } else {
        throw new Error("Submission URL was not set properly");
      }
    } catch (error) {
      console.error("Error in submit challenge:", error);
      throw error;
    }
  });
});