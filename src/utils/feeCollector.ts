import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { FEE_RECEIVER, FEE_AMOUNT } from "./token";

async function fetchBlockhashWithRetries(connection: Connection, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      return { blockhash, lastValidBlockHeight };
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw new Error("Failed to fetch blockhash after multiple attempts.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
  throw new Error("Failed to fetch blockhash after exhausting all retries.");
}

async function collectFeeWithRetries(
  connection: Connection,
  transaction: Transaction,
  retries: number
) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const txid = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 5
      });
      
      return await connection.confirmTransaction({
        signature: txid,
        blockhash: transaction.recentBlockhash!,
        lastValidBlockHeight: transaction.lastValidBlockHeight!
      }, 'confirmed');
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export const collectFee = async (
  connection: Connection,
  fromPubkey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
  const MAX_RETRIES = 3;
  
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(FEE_RECEIVER),
        lamports: FEE_AMOUNT,
      })
    );

    const { blockhash, lastValidBlockHeight } = await fetchBlockhashWithRetries(connection);
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = fromPubkey;

    const signedTx = await signTransaction(transaction);
    return await collectFeeWithRetries(connection, signedTx, MAX_RETRIES);
  } catch (error: any) {
    console.error("Fee collection error details:", error);
    let errorMessage = "Failed to process fee payment. Please try again.";
    
    if (error.message?.includes("blockhash")) {
      errorMessage = "Network congestion detected. Please try again later.";
    } else if (error.message?.includes("RPC")) {
      errorMessage = "RPC connection error. Please check your network and retry.";
    }
    
    throw new Error(errorMessage);
  }
};