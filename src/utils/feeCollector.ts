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

export const collectFee = async (
  connection: Connection,
  fromPubkey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
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
    const txid = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      maxRetries: 5
    });

    return await connection.confirmTransaction({
      signature: txid,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');
  } catch (error: any) {
    console.error("Fee collection error details:", error);
    throw error;
  }
};