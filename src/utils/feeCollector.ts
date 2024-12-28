import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { FEE_RECEIVER, FEE_AMOUNT } from "./token";

// Backup RPC endpoints
const BACKUP_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
];

async function fetchBlockhashWithRetries(connection: Connection, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      return { blockhash, lastValidBlockHeight };
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw new Error("Failed to fetch blockhash after multiple attempts");
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
    }
  }
  throw new Error("Failed to fetch blockhash after exhausting all retries");
}

async function verifyConnection(connection: Connection): Promise<boolean> {
  try {
    const version = await connection.getVersion();
    return !!version;
  } catch {
    return false;
  }
}

async function getWorkingConnection(currentEndpoint: string): Promise<Connection> {
  // First try the current endpoint
  const connection = new Connection(currentEndpoint, {
    commitment: 'finalized',
    confirmTransactionInitialTimeout: 60000,
  });

  if (await verifyConnection(connection)) {
    return connection;
  }

  // Try backup endpoints
  for (const endpoint of BACKUP_ENDPOINTS) {
    const backupConnection = new Connection(endpoint, {
      commitment: 'finalized',
      confirmTransactionInitialTimeout: 60000,
    });
    
    if (await verifyConnection(backupConnection)) {
      return backupConnection;
    }
  }

  throw new Error("Unable to connect to any RPC endpoint");
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
    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // Check if we should retry based on error type
      const shouldRetry = error.message?.includes('blockhash') || 
                         error.message?.includes('timeout') ||
                         error.message?.includes('rate limit');
      
      if (!shouldRetry || attempt >= retries - 1) {
        break;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
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
    // Verify connection and switch to backup if needed
    const workingConnection = await getWorkingConnection(connection.rpcEndpoint);
    
    // Create and configure the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(FEE_RECEIVER),
        lamports: FEE_AMOUNT,
      })
    );

    // Get blockhash with retries
    const { blockhash, lastValidBlockHeight } = await fetchBlockhashWithRetries(workingConnection);
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction with retries
    const signedTx = await signTransaction(transaction);
    return await collectFeeWithRetries(workingConnection, signedTx, MAX_RETRIES);
  } catch (error: any) {
    console.error("Fee collection error details:", error);
    
    let errorMessage = "Failed to process fee payment. Please try again.";
    if (error.message?.includes("blockhash")) {
      errorMessage = "Network congestion detected. Please try again later.";
    } else if (error.message?.includes("RPC")) {
      errorMessage = "Network connection issues. Retrying with backup endpoints...";
    } else if (error.message?.includes("insufficient")) {
      errorMessage = "Insufficient balance to pay the fee. Please add more SOL to your wallet.";
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
    }
    
    throw new Error(errorMessage);
  }
};