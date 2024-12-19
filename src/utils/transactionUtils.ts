import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const CREATION_FEE = 0.03; // Fee in SOL
export const FEE_RECIPIENT = new PublicKey("91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi");

export const createFeeTransaction = async (
  walletAddress: string,
  connection: Connection
): Promise<Transaction> => {
  const senderPubkey = new PublicKey(walletAddress);
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: FEE_RECIPIENT,
      lamports: CREATION_FEE * LAMPORTS_PER_SOL,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPubkey;

  return transaction;
};