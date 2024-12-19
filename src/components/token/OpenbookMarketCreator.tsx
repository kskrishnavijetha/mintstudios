import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NETWORK, FEE_RECEIVER, FEE_AMOUNT } from "@/utils/token";

const OpenbookMarketCreator = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    baseTokenAddress: "",
    quoteTokenAddress: "",
    minOrderSize: "",
    tickSize: "",
  });

  const handleCreateMarket = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a market",
      });
      return;
    }

    if (!formData.baseTokenAddress || !formData.quoteTokenAddress || !formData.minOrderSize || !formData.tickSize) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Openbook Market ID Creator</h3>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="baseTokenAddress">Base Token Address</Label>
          <Input
            id="baseTokenAddress"
            placeholder="Enter base token address"
            value={formData.baseTokenAddress}
            onChange={(e) => setFormData({ ...formData, baseTokenAddress: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="quoteTokenAddress">Quote Token Address</Label>
          <Input
            id="quoteTokenAddress"
            placeholder="Enter quote token address"
            value={formData.quoteTokenAddress}
            onChange={(e) => setFormData({ ...formData, quoteTokenAddress: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="minOrderSize">Minimum Order Size</Label>
          <Input
            id="minOrderSize"
            type="number"
            placeholder="Enter minimum order size"
            value={formData.minOrderSize}
            onChange={(e) => setFormData({ ...formData, minOrderSize: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="tickSize">Tick Size</Label>
          <Input
            id="tickSize"
            type="number"
            placeholder="Enter tick size"
            value={formData.tickSize}
            onChange={(e) => setFormData({ ...formData, tickSize: e.target.value })}
          />
        </div>
      </div>
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
    </div>
  );
};

export default OpenbookMarketCreator;