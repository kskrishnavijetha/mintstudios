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
        commitment: 'finalized',
        confirmTransactionInitialTimeout: 60000,
      });

      await collectFee(connection, publicKey, signTransaction);

      toast({
        title: "Fee Payment Successful",
        description: "The fee has been successfully collected",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Fee collection error:", error);
      
      toast({
        variant: "destructive",
        title: "Error collecting fee",
        description: error.message || "Failed to process fee payment. Please try again.",
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