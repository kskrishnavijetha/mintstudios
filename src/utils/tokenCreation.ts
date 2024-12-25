import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { 
  createMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";
import { NETWORK, FEE_RECEIVER, FEE_AMOUNT } from "@/utils/token";

export const createToken = async (
  connection: Connection,
  publicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  formData: {
    decimals: string;
    supply: string;
  }
) => {
  // Create and send fee transaction
  const feeTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(FEE_RECEIVER),
      lamports: FEE_AMOUNT,
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  feeTransaction.recentBlockhash = blockhash;
  feeTransaction.feePayer = publicKey;

  // Send fee transaction with confirmation
  const feeSignature = await sendTransaction(feeTransaction, connection);
  const confirmation = await connection.confirmTransaction({
    signature: feeSignature,
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight
  }, 'confirmed');

  if (confirmation.value.err) {
    throw new Error("Fee transaction failed");
  }

  // Create mint account with shorter confirmation timeout
  const mintAccount = await createMint(
    connection,
    {
      publicKey: publicKey,
      secretKey: new Uint8Array(0),
    },
    publicKey,
    publicKey,
    Number(formData.decimals),
    undefined,
    {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    },
    TOKEN_PROGRAM_ID
  );

  // Get associated token account address
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mintAccount,
    publicKey
  );

  // Create associated token account
  await createAssociatedTokenAccount(
    connection,
    {
      publicKey: publicKey,
      secretKey: new Uint8Array(0),
    },
    mintAccount,
    publicKey,
    {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    }
  );

  // Mint tokens with shorter confirmation timeout
  await mintTo(
    connection,
    {
      publicKey: publicKey,
      secretKey: new Uint8Array(0),
    },
    mintAccount,
    associatedTokenAddress,
    publicKey,
    Number(formData.supply) * Math.pow(10, Number(formData.decimals)),
    [],
    {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    }
  );

  return mintAccount;
};