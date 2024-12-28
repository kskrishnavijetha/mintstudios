import { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { FEE_AMOUNT, FEE_RECEIVER, RPC_ENDPOINTS, RETRY_DELAYS } from "./token";

export type TokenCreationParams = {
  connection: Connection;
  signer: {
    publicKey: PublicKey;
    secretKey: null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
  };
  supply: number;
  decimals: number;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getWorkingConnection(): Promise<Connection> {
  for (const endpoint of RPC_ENDPOINTS) {
    const connection = new Connection(endpoint, 'confirmed');
    try {
      await connection.getVersion();
      return connection;
    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed, trying next one...`);
      continue;
    }
  }
  throw new Error('All RPC endpoints are unavailable');
}

async function getLatestBlockhashWithRetry(connection: Connection): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
  for (const delay of RETRY_DELAYS) {
    try {
      return await connection.getLatestBlockhash('finalized');
    } catch (error) {
      console.warn(`Failed to get blockhash, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  throw new Error('Failed to get latest blockhash after multiple retries');
}

export const createToken = async ({
  connection,
  signer,
  supply,
  decimals
}: TokenCreationParams) => {
  const mintKeypair = Keypair.generate();

  const mint = await createMint(
    connection,
    signer,
    signer.publicKey,
    signer.publicKey,
    decimals,
    mintKeypair
  );

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    signer.publicKey
  );

  await mintTo(
    connection,
    signer,
    mint,
    tokenAccount.address,
    signer.publicKey,
    supply
  );

  return mint;
};

export const payFee = async (
  connection: Connection,
  signer: {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
  }
) => {
  // Get a working connection from the pool of endpoints
  const workingConnection = await getWorkingConnection();
  
  // Get latest blockhash with retry mechanism
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhashWithRetry(workingConnection);
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: new PublicKey(FEE_RECEIVER),
      lamports: FEE_AMOUNT,
    })
  );

  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = signer.publicKey;

  // Sign and send transaction with retries
  for (const delay of RETRY_DELAYS) {
    try {
      const signedTx = await signer.signTransaction(transaction);
      const txid = await workingConnection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 5
      });

      const confirmation = await workingConnection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      return confirmation;
    } catch (error) {
      console.warn(`Transaction failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw new Error('Failed to complete transaction after multiple retries');
};