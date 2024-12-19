import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createFeeTransaction, MARKET_ID_FEE } from "@/utils/transactionUtils";

export const MarketIdCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    baseToken: "",
    minOrderSize: "",
    tickSize: "",
  });

  const handleCreate = async () => {
    try {
      if (!window.solana || !window.solana.isConnected) {
        toast({
          variant: "destructive",
          title: "Wallet Not Connected",
          description: "Please connect your wallet first",
        });
        return;
      }

      setIsLoading(true);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Create and send fee transaction
      const feeTransaction = await createFeeTransaction(
        window.solana.publicKey.toString(),
        connection,
        'market_id'
      );
      
      const signature = await window.solana.signAndSendTransaction(feeTransaction);
      await connection.confirmTransaction(signature);

      console.log(`Creating market ID for token: ${formData.baseToken}`);
      // Here you would implement the actual market ID creation logic

      toast({
        title: "Market ID Created",
        description: "Successfully created market ID",
      });
    } catch (error) {
      console.error("Error creating market ID:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create market ID",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Create Openbook Market ID</h3>
        <span className="text-sm text-muted-foreground">Fee: {MARKET_ID_FEE} SOL</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="baseToken">Base Token</Label>
        <Input
          id="baseToken"
          placeholder="Enter base token address"
          value={formData.baseToken}
          onChange={(e) => handleChange("baseToken", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="minOrderSize">Minimum Order Size</Label>
        <Input
          id="minOrderSize"
          type="number"
          placeholder="Enter minimum order size"
          value={formData.minOrderSize}
          onChange={(e) => handleChange("minOrderSize", e.target.value)}
        />
        <span className="text-xs text-muted-foreground">
          For min order size 0.01 enter 2, for 0.1 enter 1, for 1 enter 0, for 10 enter -1, for 100 enter -2
        </span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tickSize">Tick Size</Label>
        <Input
          id="tickSize"
          type="number"
          placeholder="Enter tick size"
          value={formData.tickSize}
          onChange={(e) => handleChange("tickSize", e.target.value)}
        />
        <span className="text-xs text-muted-foreground">
          For tick size 0.0001 enter 4, for 0.00001 enter 5, for 0.000001 enter 6, for 0.0000001 enter 7
        </span>
      </div>

      <Button 
        onClick={handleCreate} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Market ID...
          </>
        ) : (
          "Create Market ID"
        )}
      </Button>
    </div>
  );
};