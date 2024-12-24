import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import TokenFormFields from "./token/TokenFormFields";
import SocialLinks from "./token/SocialLinks";
import OpenbookMarketCreator from "./token/OpenbookMarketCreator";
import FreezeAuthorityRevoker from "./token/FreezeAuthorityRevoker";
import MintAuthorityRevoker from "./token/MintAuthorityRevoker";
import { NETWORK } from "@/utils/token";
import { createToken, payFee } from "@/utils/tokenCreation";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const { publicKey, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl(NETWORK), {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 120000,
        wsEndpoint: "wss://api.mainnet-beta.solana.com/",
      });

      const signer = {
        publicKey,
        secretKey: null,
        signTransaction
      };

      // Create token
      const mint = await createToken({
        connection,
        signer,
        supply: Number(formData.supply) * Math.pow(10, Number(formData.decimals)),
        decimals: Number(formData.decimals)
      });

      // Pay fee
      const confirmation = await payFee(connection, signer);

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      toast({
        title: "Token Created Successfully",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}. Mint address: ${mint.toBase58()}`,
      });

    } catch (error: any) {
      console.error("Error details:", error);
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: error.message || "Failed to process transaction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TokenFormFields
          formData={formData}
          setFormData={setFormData}
          handleSupplyChange={(value) => setFormData({ ...formData, supply: value })}
        />

        <div className="grid gap-2">
          <Label htmlFor="image">Token Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Token preview"
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter token description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <SocialLinks formData={formData} setFormData={setFormData} />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            "Create Token (Fee: 0.03 SOL)"
          )}
        </Button>
      </form>

      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Token Management</h3>
        <div className="space-y-4">
          <OpenbookMarketCreator />
          <FreezeAuthorityRevoker />
          <MintAuthorityRevoker />
        </div>
      </div>
    </div>
  );
};

export default TokenCreationForm;
