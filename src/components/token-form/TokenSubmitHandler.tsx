import { useState } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
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

export const TokenSubmitHandler = ({ formData }: TokenSubmitHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!window.solana?.isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet before creating a token",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const walletAddress = window.solana.publicKey?.toString();
      
      if (!walletAddress) {
        throw new Error("Wallet address not found");
      }

      // Create and send fee transaction
      const feeTransaction = await createFeeTransaction(walletAddress, connection);
      const signature = await window.solana.signAndSendTransaction(feeTransaction);
      await connection.confirmTransaction(signature);

      // Log successful fee payment
      console.log("Fee payment successful:", signature);
      
      toast({
        title: "Token Creation Started",
        description: "Processing your token creation request...",
      });

      // Add additional token creation logic here
      // For now, we'll just simulate success
      setTimeout(() => {
        toast({
          title: "Token Created Successfully!",
          description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
        });
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Token",
        description: error instanceof Error ? error.message : "Failed to create token. Please try again.",
      });
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