import { useState } from "react";
import { TokenSubmitHandler } from "./token-form/TokenSubmitHandler";
import { MarketIdCreator } from "./token-form/MarketIdCreator";
import { FreezeAuthorityRevoker } from "./token-form/FreezeAuthorityRevoker";
import { MintAuthorityRevoker } from "./token-form/MintAuthorityRevoker";
import { BasicInformation } from "./token-form/BasicInformation";
import { TokenDetails } from "./token-form/TokenDetails";
import { SocialLinks } from "./token-form/SocialLinks";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "./WalletConnect";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    description: "",
    image: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      handleFieldChange("image", imageUrl);
      
      toast({
        title: "Image Selected",
        description: "Image has been selected successfully",
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create Token</h3>
          <WalletConnect />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformation 
            formData={formData} 
            onFieldChange={handleFieldChange} 
          />

          <TokenDetails 
            formData={formData}
            onFieldChange={handleFieldChange}
            onImageUpload={handleImageUpload}
            selectedImage={selectedImage}
          />

          <SocialLinks 
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <TokenSubmitHandler formData={formData} />
        </form>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create Market</h3>
            <WalletConnect />
          </div>
          <MarketIdCreator />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Revoke Freeze Authority</h3>
            <WalletConnect />
          </div>
          <FreezeAuthorityRevoker />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Revoke Mint Authority</h3>
            <WalletConnect />
          </div>
          <MintAuthorityRevoker />
        </div>
      </div>
    </div>
  );
};

export default TokenCreationForm;