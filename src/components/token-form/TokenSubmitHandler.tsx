import { useState } from "react";
import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { useToast } from "@/hooks/use-toast";
import { createFeeTransaction } from "@/utils/transactionUtils";
import { SubmitButton } from "./SubmitButton";
import { FeeDisplay } from "./FeeDisplay";

// Initialize Buffer globally if not already initialized
import { Buffer } from 'buffer';
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

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

export const TokenSubmitHandler = ({ formData }: TokenSubmitHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      
      // Create a new keypair for the mint
      const mintKeypair = Keypair.generate();
      const walletPublicKey = mintKeypair.publicKey;

      // Create the token mint
      const mint = await createMint(
        connection,
        mintKeypair,
        walletPublicKey,
        walletPublicKey,
        Number(formData.decimals)
      );

      console.log("Token mint created:", mint.toBase58());

      // Get the token account
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintKeypair,
        mint,
        walletPublicKey
      );

      console.log("Token account:", tokenAccount.address.toBase58());

      // Mint tokens to the token account
      const mintTx = await mintTo(
        connection,
        mintKeypair,
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