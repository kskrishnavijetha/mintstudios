import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { FEE_AMOUNT, FEE_RECEIVER } from "./token";

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

export const createToken = async ({
  connection,
  signer,
  supply,
  decimals
}: TokenCreationParams) => {
  // Create a temporary keypair for the mint
  const mintKeypair = Keypair.generate();

  // Create the token mint
  const mint = await createMint(
    connection,
    signer,
    signer.publicKey,
    signer.publicKey,
    decimals,
    mintKeypair
  );

  // Get the token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    mint,
    signer.publicKey
  );

  // Mint tokens
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
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  
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

  const signedTx = await signer.signTransaction(transaction);
  
  const txid = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
    maxRetries: 5
  });

  return connection.confirmTransaction({
    signature: txid,
    blockhash,
    lastValidBlockHeight
  });
};