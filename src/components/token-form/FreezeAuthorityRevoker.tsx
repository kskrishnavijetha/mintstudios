import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "../WalletConnect";

interface FreezeAuthorityRevokerProps {
  walletAddress: string | null;
}

export const FreezeAuthorityRevoker = ({ walletAddress }: FreezeAuthorityRevokerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const { toast } = useToast();

  const handleRevoke = async () => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to revoke freeze authority",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Revoking freeze authority for wallet: ${walletAddress}`);
      // Here you would implement the actual revoke logic
      setTimeout(() => {
        toast({
          title: "Freeze Authority Revoked",
          description: "Successfully revoked freeze authority",
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error revoking freeze authority:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Freeze Authority</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Fee: 0.03 SOL</span>
          <WalletConnect />
        </div>
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
        disabled={isLoading || !walletAddress}
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
