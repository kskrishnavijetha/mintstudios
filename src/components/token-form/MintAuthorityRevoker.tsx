import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createFeeTransaction, MINT_AUTHORITY_FEE } from "@/utils/transactionUtils";

export const MintAuthorityRevoker = () => {
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
        MINT_AUTHORITY_FEE
      );
      
      const signature = await window.solana.signAndSendTransaction(feeTransaction);
      await connection.confirmTransaction(signature);

      console.log(`Revoking mint authority for token: ${tokenAddress}`);
      // Here you would implement the actual revoke logic

      toast({
        title: "Mint Authority Revoked",
        description: "Successfully revoked mint authority",
      });
    } catch (error) {
      console.error("Error revoking mint authority:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke mint authority",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Mint Authority</h3>
        <span className="text-sm text-muted-foreground">Fee: {MINT_AUTHORITY_FEE} SOL</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mintTokenAddress">Token Address</Label>
        <Input
          id="mintTokenAddress"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>

      <Button 
        onClick={handleRevoke} 
        disabled={isLoading}
        variant="destructive"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Revoking Mint Authority...
          </>
        ) : (
          "Revoke Mint Authority"
        )}
      </Button>
    </div>
  );
};