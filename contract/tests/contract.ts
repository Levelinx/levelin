import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { expect } from "chai";

describe("contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.contract as Program<Contract>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Can store a value", async () => {
    // Generate a new keypair for our value account
    const valueAccount = anchor.web3.Keypair.generate();
    
    // The value we want to store
    const valueToStore = new anchor.BN(42);
    const strToStore = "Hello, world!";
    
    // Store the value
    const tx = await program.methods
      .storeValue(valueToStore, strToStore)
      .accounts({
        valueAccount: valueAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
      })
      .signers([valueAccount])
      .rpc();
      
    console.log("Store value transaction signature", tx);
    
    // Fetch the created account
    const account = await program.account.valueData.fetch(valueAccount.publicKey);
    const storedText = Buffer.from(account.text.slice(0, account.textLen)).toString('utf8');

    console.log("Account", account.value.toNumber(), storedText);
    
    // Verify the value was stored correctly
    expect(account.value.toNumber()).to.equal(valueToStore.toNumber());
    expect(storedText).to.equal(strToStore);
  });
});
