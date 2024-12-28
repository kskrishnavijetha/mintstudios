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
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
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
        preflightCommitment: 'finalized',
        maxRetries: 5
      });
      
      const confirmation = await connection.confirmTransaction({
        signature: txid,
        blockhash: transaction.recentBlockhash!,
        lastValidBlockHeight: transaction.lastValidBlockHeight!
      }, 'finalized');

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      return confirmation;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
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
    // Create and configure the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(FEE_RECEIVER),
        lamports: FEE_AMOUNT,
      })
    );

    // Get blockhash with retries
    const { blockhash, lastValidBlockHeight } = await fetchBlockhashWithRetries(connection);
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction with retries
    const signedTx = await signTransaction(transaction);
    return await collectFeeWithRetries(connection, signedTx, MAX_RETRIES);
  } catch (error: any) {
    console.error("Fee collection error details:", error);
    
    let errorMessage = "Failed to process fee payment. Please try again.";
    if (error.message?.includes("blockhash")) {
      errorMessage = "Network congestion detected. Please try again later.";
    } else if (error.message?.includes("RPC")) {
      errorMessage = "RPC connection error. Please check your network and retry.";
    } else if (error.message?.includes("insufficient")) {
      errorMessage = "Insufficient balance to pay the fee. Please add more SOL to your wallet.";
    }
    
    throw new Error(errorMessage);
  }
};