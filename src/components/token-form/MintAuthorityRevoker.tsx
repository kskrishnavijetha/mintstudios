import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MintAuthorityRevoker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const { toast } = useToast();

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      console.log(`Revoking mint authority for token: ${tokenAddress}`);
      // Here you would implement the actual revoke logic
      setTimeout(() => {
        toast({
          title: "Mint Authority Revoked",
          description: "Successfully revoked mint authority",
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error revoking mint authority:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Mint Authority</h3>
        <span className="text-sm text-muted-foreground">Fee: 0.02 SOL</span>
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
