import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NETWORK, FEE_RECEIVER, FEE_AMOUNT } from "@/utils/token";

const MintAuthorityRevoker = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const handleRevokeMint = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to revoke mint authority",
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
        title: "Mint Authority Revoked",
        description: "Successfully revoked mint authority",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error revoking mint authority",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Revoke Mint Authority</h3>
      <p className="text-sm text-muted-foreground">
        Revoking mint authority ensures that there can be no more tokens minted than the total supply. 
        This provides security and peace of mind to buyers. The cost is 0.03 SOL.
      </p>
      <div>
        <Label htmlFor="mintTokenAddress">Token Address</Label>
        <Input
          id="mintTokenAddress"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>
      <Button 
        onClick={handleRevokeMint} 
        disabled={isLoading} 
        className="w-full"
        variant="destructive"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Revoking Mint Authority...
          </>
        ) : (
          "Revoke Mint Authority (Fee: 0.03 SOL)"
        )}
      </Button>
    </div>
  );
};

export default MintAuthorityRevoker;