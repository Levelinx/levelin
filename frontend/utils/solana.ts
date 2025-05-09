import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, setProvider, web3, BN, Idl } from '@coral-xyz/anchor';
import idl from '../public/contract.json'; // Make sure to export your IDL

export const PROGRAM_ID = new PublicKey('Db48pxhkNZzJgt8ddMkhY6xbsmoPpTzPDqHuPtDSQBGr');

export const connection = new Connection(clusterApiUrl('devnet'));

export const findProgramAuthorityPDA = async () => {
  console.log("Finding Program Authority PDA")
  const [pda, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('PROGRAM_AUTHORITY')],
    PROGRAM_ID
  );
  return pda;
};

export const getProgram = async (privyWallet: any) => {
  const provider = new AnchorProvider(connection, privyWallet.address, {});
  setProvider(provider);
  const program = new Program(idl as any, provider);
  return program;
};