import { useState } from "react";
import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { useToast } from "@/hooks/use-toast";
import { createFeeTransaction } from "@/utils/transactionUtils";
import { SubmitButton } from "./SubmitButton";
import { FeeDisplay } from "./FeeDisplay";

interface TokenSubmitHandlerProps {
  formData: {
    name: string;
    symbol: string;
    supply: string;
    decimals: string;
    description: string;
    image: string;
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
  };
}

// Create a wallet adapter that implements the Signer interface
const createWalletAdapter = (phantomWallet: any) => {
  return {
    publicKey: phantomWallet.publicKey,
    secretKey: new Uint8Array(32), // Dummy secret key, not used with Phantom
    async signTransaction(tx: any) {
      return await phantomWallet.signTransaction(tx);
    },
    async signAllTransactions(txs: any[]) {
      return await phantomWallet.signAllTransactions(txs);
    }
  };
};

export const TokenSubmitHandler = ({ formData }: TokenSubmitHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!window.solana) {
        console.error("Wallet not found");
        toast({
          variant: "destructive",
          title: "Wallet Not Found",
          description: "Please install and connect a Solana wallet",
        });
        return;
      }

      if (!window.solana.isConnected) {
        console.error("Wallet not connected");
        toast({
          variant: "destructive",
          title: "Wallet Not Connected",
          description: "Please connect your wallet before creating a token",
        });
        return;
      }

      setIsLoading(true);
      console.log("Starting token creation process...");

      // Create connection to devnet
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      console.log("Connected to Solana devnet");

      // Get wallet public key and convert it to PublicKey object
      const walletPublicKey = new PublicKey(window.solana.publicKey.toString());
      console.log("Wallet public key:", walletPublicKey.toString());

      // Create wallet adapter
      const walletAdapter = createWalletAdapter(window.solana);

      // Create and send fee transaction
      console.log("Creating fee transaction...");
      const feeTransaction = await createFeeTransaction(walletPublicKey.toString(), connection);
      
      console.log("Sending fee transaction for signing...");
      const signature = await window.solana.signAndSendTransaction(feeTransaction);
      console.log("Fee transaction signature:", signature);

      console.log("Waiting for fee transaction confirmation...");
      await connection.confirmTransaction(signature);
      console.log("Fee transaction confirmed");

      // Create the token mint
      console.log("Creating token mint...");
      const mint = await createMint(
        connection,
        walletAdapter,
        walletPublicKey,
        walletPublicKey,
        Number(formData.decimals)
      );
      console.log("Token mint created:", mint.toString());

      // Create associated token account
      console.log("Creating associated token account...");
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        walletAdapter,
        mint,
        walletPublicKey
      );
      console.log("Token account created:", tokenAccount.address.toString());

      // Mint tokens
      console.log("Minting tokens...");
      const mintAmount = BigInt(Number(formData.supply) * Math.pow(10, Number(formData.decimals)));
      await mintTo(
        connection,
        walletAdapter,
        mint,
        tokenAccount.address,
        walletPublicKey,
        mintAmount
      );
      console.log("Tokens minted successfully");

      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });

    } catch (error) {
      console.error("Error in token creation:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Token",
        description: error instanceof Error ? error.message : "Failed to create token. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FeeDisplay />
      <SubmitButton isLoading={isLoading} onClick={handleSubmit} />
    </div>
  );
};