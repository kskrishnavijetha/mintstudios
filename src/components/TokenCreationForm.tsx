import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import TokenFormFields from "./token/TokenFormFields";
import MarketSettings from "./token/MarketSettings";
import WalletStatus from "./wallet/WalletStatus";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const { connected, publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    minOrderSize: "0",
    tickSize: "6",
  });

  const getRecommendedSizes = (supply: number) => {
    if (supply <= 100000) return { minOrder: "0.01", tick: "0.0001", minOrderSetting: "2", tickSetting: "4" };
    if (supply <= 1000000) return { minOrder: "0.1", tick: "0.00001", minOrderSetting: "1", tickSetting: "5" };
    if (supply <= 10000000) return { minOrder: "1", tick: "0.000001", minOrderSetting: "0", tickSetting: "6" };
    if (supply <= 100000000) return { minOrder: "10", tick: "0.0000001", minOrderSetting: "-1", tickSetting: "7" };
    return { minOrder: "100", tick: "0.00000001", minOrderSetting: "-2", tickSetting: "8" };
  };

  const handleSupplyChange = (value: string) => {
    const supply = Number(value);
    const recommended = getRecommendedSizes(supply);
    setFormData(prev => ({
      ...prev,
      supply: value,
      minOrderSize: recommended.minOrderSetting,
      tickSize: recommended.tickSetting
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a connection to the Solana devnet
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
      
      // Create a transaction to send the creation fee
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new web3.PublicKey('91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi'),
          lamports: web3.LAMPORTS_PER_SOL * 0.03, // 0.03 SOL fee
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send the transaction
      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature);

      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
    } catch (error) {
      console.error('Error creating token:', error);
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end mb-4">
        <WalletStatus />
      </div>

      <TokenFormFields 
        formData={formData}
        setFormData={setFormData}
        handleSupplyChange={handleSupplyChange}
      />

      <MarketSettings 
        formData={formData}
        setFormData={setFormData}
      />

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Creation Fee: <span className="text-foreground">0.03 SOL</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Fee recipient: 91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi
          </p>
        </div>

        <Button className="w-full" type="submit" disabled={isLoading || !connected}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            "Create Token"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TokenCreationForm;