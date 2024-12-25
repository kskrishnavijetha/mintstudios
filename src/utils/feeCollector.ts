import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { FEE_RECEIVER, FEE_AMOUNT } from "./token";

export const collectFee = async (
  connection: Connection,
  fromPubkey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey: new PublicKey(FEE_RECEIVER),
      lamports: FEE_AMOUNT,
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = fromPubkey;

  const signedTx = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signedTx.serialize());

  return connection.confirmTransaction({
    signature: txid,
    blockhash,
    lastValidBlockHeight
  });
};