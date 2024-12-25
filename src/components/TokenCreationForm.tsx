import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import TokenFormFields from "./token/TokenFormFields";
import SocialLinks from "./token/SocialLinks";
import OpenbookMarketCreator from "./token/OpenbookMarketCreator";
import FreezeAuthorityRevoker from "./token/FreezeAuthorityRevoker";
import MintAuthorityRevoker from "./token/MintAuthorityRevoker";
import { NETWORK } from "@/utils/token";
import { createToken } from "@/utils/tokenCreation";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const { publicKey, sendTransaction } = useWallet();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
      });
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(`https://api.${NETWORK}.solana.com`, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000, // 60 seconds timeout
      });
      
      const mintAccount = await createToken(connection, publicKey, sendTransaction, formData);

      toast({
        title: "Token Created Successfully",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });

    } catch (error) {
      console.error("Token creation error:", error);
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: "Transaction timed out. Please try again and make sure to approve the transaction promptly.",
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