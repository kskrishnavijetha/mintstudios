import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { FEE_RECEIVER, FEE_AMOUNT } from "./token";

// Backup RPC endpoints with preferred order
const BACKUP_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.ankr.com/solana"
];

async function fetchBlockhashWithRetries(connection: Connection, retries = 3): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await connection.getLatestBlockhash('finalized');
    } catch (err) {
      console.error(`Blockhash fetch attempt ${attempt + 1} failed:`, err);
      lastError = err;
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
      }
    }
  }
  throw lastError;
}

async function verifyConnection(connection: Connection): Promise<boolean> {
  try {
    const version = await connection.getVersion();
    return !!version;
  } catch {
    return false;
  }
}

async function getWorkingConnection(): Promise<Connection> {
  for (const endpoint of BACKUP_ENDPOINTS) {
    console.log(`Trying RPC endpoint: ${endpoint}`);
    const connection = new Connection(endpoint, {
      commitment: 'finalized',
      confirmTransactionInitialTimeout: 60000,
    });

    if (await verifyConnection(connection)) {
      console.log(`Successfully connected to: ${endpoint}`);
      return connection;
    }
    console.log(`Failed to connect to: ${endpoint}`);
  }

  throw new Error("Unable to connect to any RPC endpoint");
}

export const collectFee = async (
  connection: Connection,
  fromPubkey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
  const MAX_RETRIES = 3;
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Fee collection attempt ${attempt + 1}`);
      
      // Get a working connection
      const workingConnection = await getWorkingConnection();
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(FEE_RECEIVER),
          lamports: FEE_AMOUNT,
        })
      );

      // Get blockhash
      const { blockhash, lastValidBlockHeight } = await fetchBlockhashWithRetries(workingConnection);
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = fromPubkey;

      // Sign and send transaction
      const signedTx = await signTransaction(transaction);
      const signature = await workingConnection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'finalized',
        maxRetries: 3
      });

      console.log(`Transaction sent with signature: ${signature}`);

      // Wait for confirmation
      const confirmation = await workingConnection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'finalized');

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log("Transaction confirmed successfully");
      return confirmation;

    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;

      const shouldRetry = error.message?.includes('blockhash') || 
                         error.message?.includes('timeout') ||
                         error.message?.includes('rate limit') ||
                         error.message?.includes('network');

      if (!shouldRetry || attempt >= MAX_RETRIES - 1) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
    }
  }

  let errorMessage = "Failed to process fee payment. Please try again.";
  if (lastError?.message?.includes("blockhash")) {
    errorMessage = "Network congestion detected. Please try again in a few moments.";
  } else if (lastError?.message?.includes("insufficient")) {
    errorMessage = "Insufficient balance to pay the fee. Please add more SOL to your wallet.";
  } else if (lastError?.message?.includes("rate limit")) {
    errorMessage = "Too many requests. Please wait a moment and try again.";
  }

  throw new Error(errorMessage);
};