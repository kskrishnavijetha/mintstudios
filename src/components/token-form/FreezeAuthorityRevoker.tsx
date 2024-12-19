import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import WalletConnect from "../WalletConnect";

const FEE_COLLECTION_ADDRESS = "91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi";

export const FreezeAuthorityRevoker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      console.log(`Collecting 0.03 SOL fee to address: ${FEE_COLLECTION_ADDRESS}`);
      // Here you would implement the actual fee collection logic
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error collecting fee:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Freeze Authority</h3>
        <span className="text-sm text-muted-foreground">Fee: 0.03 SOL</span>
      </div>

      <div className="flex justify-end">
        <WalletConnect />
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