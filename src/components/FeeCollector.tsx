import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { NETWORK } from "@/utils/token";
import { collectFee } from "@/utils/feeCollector";

interface FeeCollectorProps {
  onSuccess?: () => void;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

const FeeCollector = ({ 
  onSuccess, 
  buttonText = "Pay Fee (0.03 SOL)",
  variant = "default",
  disabled = false
}: FeeCollectorProps) => {
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFeeCollection = async () => {
    if (!publicKey || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl(NETWORK), {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      });

      const confirmation = await collectFee(connection, publicKey, signTransaction);

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      toast({
        title: "Fee Payment Successful",
        description: "The fee has been successfully collected",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Fee collection error:", error);
      
      let errorMessage = "Failed to process fee payment. Please try again.";
      if (error.message?.includes("403")) {
        errorMessage = "RPC connection error. Please try again in a few moments.";
      } else if (error.message?.includes("blockhash")) {
        errorMessage = "Network congestion detected. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Error collecting fee",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFeeCollection}
      disabled={isLoading || disabled}
      variant={variant}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default FeeCollector;