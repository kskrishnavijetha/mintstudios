import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NETWORK, FEE_RECEIVER, FEE_AMOUNT } from "@/utils/token";

const OpenbookMarketCreator = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMarket = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a market",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(`https://api.${NETWORK}.solana.com`);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(FEE_RECEIVER),
          lamports: FEE_AMOUNT,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      toast({
        title: "Market Creation Initiated",
        description: "Openbook market creation process started",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating market",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCreateMarket} 
      disabled={isLoading} 
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Market...
        </>
      ) : (
        "Create Openbook Market (Fee: 0.03 SOL)"
      )}
    </Button>
  );
};

export default OpenbookMarketCreator;