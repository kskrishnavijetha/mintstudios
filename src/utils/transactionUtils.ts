import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const CREATION_FEE = 0.03; // Fee in SOL
export const MARKET_ID_FEE = 0.03; // Fee in SOL
export const FREEZE_AUTHORITY_FEE = 0.03; // Fee in SOL
export const MINT_AUTHORITY_FEE = 0.03; // Fee in SOL (updated from 0.02)
export const FEE_RECIPIENT = new PublicKey("64tMohDoBgFNRsm8U4XWbjFuixVs1qPLfmgoD8gR5ijo");

type FeeType = 'token_creation' | 'market_id' | 'freeze_authority' | 'mint_authority';

const getFeeAmount = (feeType: FeeType): number => {
  switch (feeType) {
    case 'token_creation':
      return CREATION_FEE;
    case 'market_id':
      return MARKET_ID_FEE;
    case 'freeze_authority':
      return FREEZE_AUTHORITY_FEE;
    case 'mint_authority':
      return MINT_AUTHORITY_FEE;
    default:
      return CREATION_FEE;
  }
};

export const createFeeTransaction = async (
  walletAddress: string,
  connection: Connection,
  feeType: FeeType
): Promise<Transaction> => {
  const senderPubkey = new PublicKey(walletAddress);
  const feeAmount = getFeeAmount(feeType);
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: FEE_RECIPIENT,
      lamports: feeAmount * LAMPORTS_PER_SOL,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPubkey;

  return transaction;
};