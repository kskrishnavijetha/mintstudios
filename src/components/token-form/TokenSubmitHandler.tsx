import { useState } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import { createFeeTransaction } from "@/utils/transactionUtils";
import { SubmitButton } from "./SubmitButton";
import { FeeDisplay } from "./FeeDisplay";

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
      const transaction = await createFeeTransaction(walletAddress, connection);

      const { solana } = window;
      if (!solana?.isConnected) {
        throw new Error("Wallet not connected");
      }

      const signedTx = await solana.signAndSendTransaction(transaction);
      console.log("Transaction sent:", signedTx);
      
      const confirmation = await connection.confirmTransaction(signedTx, 'confirmed');
      console.log("Transaction confirmed:", confirmation);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Token",
        description: "Failed to process the token creation. Please try again.",
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