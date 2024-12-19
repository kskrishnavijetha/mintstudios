import { useState } from "react";
import { Connection, clusterApiUrl, PublicKey, Transaction, Keypair, Signer } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { useToast } from "@/hooks/use-toast";
import { createFeeTransaction } from "@/utils/transactionUtils";
import { SubmitButton } from "./SubmitButton";
import { FeeDisplay } from "./FeeDisplay";

// Initialize Buffer for browser environment
if (typeof window !== 'undefined') {
  const buffer = require('buffer');
  if (!window.Buffer) {
    window.Buffer = buffer.Buffer;
  }
}

interface TokenSubmitHandlerProps {
  walletAddress: string | null;
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

export const TokenSubmitHandler = ({ walletAddress, formData }: TokenSubmitHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a token",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const { solana } = window;
      
      if (!solana?.isConnected || !solana.publicKey) {
        throw new Error("Wallet not connected");
      }

      const walletPublicKey = new PublicKey(solana.publicKey.toString());
      
      // Create a Signer interface instead of trying to cast to Keypair
      const signer: Signer = {
        publicKey: walletPublicKey,
        secretKey: Keypair.generate().secretKey,
        signTransaction: async (transaction: Transaction) => {
          return await solana.signTransaction(transaction);
        },
        signAllTransactions: async (transactions: Transaction[]) => {
          return await solana.signAllTransactions(transactions);
        }
      };

      // Create the token mint
      const mint = await createMint(
        connection,
        signer,
        walletPublicKey,
        walletPublicKey,
        Number(formData.decimals)
      );

      console.log("Token mint created:", mint.toBase58());

      // Get the token account
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        walletPublicKey
      );

      console.log("Token account:", tokenAccount.address.toBase58());

      // Mint tokens to the token account
      const mintTx = await mintTo(
        connection,
        signer,
        mint,
        tokenAccount.address,
        walletPublicKey,
        Number(formData.supply) * Math.pow(10, Number(formData.decimals))
      );

      console.log("Mint transaction:", mintTx);

      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Token",
        description: "Failed to create token. Please try again.",
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