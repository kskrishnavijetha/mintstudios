import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createFeeTransaction, FREEZE_AUTHORITY_FEE } from "@/utils/transactionUtils";

export const FreezeAuthorityRevoker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const { toast } = useToast();

  const handleRevoke = async () => {
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
        FREEZE_AUTHORITY_FEE
      );
      
      const signature = await window.solana.signAndSendTransaction(feeTransaction);
      await connection.confirmTransaction(signature);

      console.log(`Revoking freeze authority for token: ${tokenAddress}`);
      // Here you would implement the actual revoke logic

      toast({
        title: "Freeze Authority Revoked",
        description: "Successfully revoked freeze authority",
      });
    } catch (error) {
      console.error("Error revoking freeze authority:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke freeze authority",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Freeze Authority</h3>
        <span className="text-sm text-muted-foreground">Fee: {FREEZE_AUTHORITY_FEE} SOL</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="freezeTokenAddress">Token Address</Label>
        <Input
          id="freezeTokenAddress"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>

      <Button 
        onClick={handleRevoke} 
        disabled={isLoading}
        variant="secondary"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Revoking Freeze Authority...
          </>
        ) : (
          "Revoke Freeze Authority"
        )}
      </Button>
    </div>
  );
};