import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "./token-form/FormField";
import { FeeDisplay } from "./token-form/FeeDisplay";
import { SubmitButton } from "./token-form/SubmitButton";
import { MarketIdCreator } from "./token-form/MarketIdCreator";
import { FreezeAuthorityRevoker } from "./token-form/FreezeAuthorityRevoker";
import { MintAuthorityRevoker } from "./token-form/MintAuthorityRevoker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Link, Image, Upload } from "lucide-react";
import { Button } from "./ui/button";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      handleFieldChange("image", imageUrl);
      
      toast({
        title: "Image Selected",
        description: "Image has been selected successfully",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate token creation
    setTimeout(() => {
      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Basic Token Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <FormField
              id="name"
              label="Token Name"
              placeholder="My Token"
              value={formData.name}
              onChange={(value) => handleFieldChange("name", value)}
              required
            />

            <FormField
              id="symbol"
              label="Token Symbol"
              placeholder="MTK"
              value={formData.symbol}
              onChange={(value) => handleFieldChange("symbol", value)}
              required
            />

            <FormField
              id="supply"
              label="Total Supply"
              type="number"
              placeholder="1000000"
              value={formData.supply}
              onChange={(value) => handleFieldChange("supply", value)}
              required
            />

            <FormField
              id="decimals"
              label="Decimals"
              type="number"
              value={formData.decimals}
              onChange={(value) => handleFieldChange("decimals", value)}
              required
            />
          </div>

          {/* Token Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Token Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="image">Token Image</Label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </Button>
                  </div>
                  {formData.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.image}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {selectedImage && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your token..."
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5" />
                <Input
                  id="website"
                  placeholder="Website URL"
                  value={formData.website}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <Input
                  id="twitter"
                  placeholder="Twitter URL"
                  value={formData.twitter}
                  onChange={(e) => handleFieldChange("twitter", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 4.5L2.5 12.5L21.5 20.5L21.5 4.5Z" />
                  <path d="M21.5 4.5L2.5 12.5V19.5L21.5 4.5Z" />
                </svg>
                <Input
                  id="telegram"
                  placeholder="Telegram URL"
                  value={formData.telegram}
                  onChange={(e) => handleFieldChange("telegram", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5.5 8.5C9 8.5 11.5 6 11.5 6C11.5 6 14 8.5 17.5 8.5C20 8.5 22 6.5 22 6.5V19.5C22 19.5 20 21.5 17.5 21.5C14 21.5 11.5 19 11.5 19C11.5 19 9 21.5 5.5 21.5C3 21.5 1 19.5 1 19.5V6.5C1 6.5 3 8.5 5.5 8.5Z" />
                </svg>
                <Input
                  id="discord"
                  placeholder="Discord URL"
                  value={formData.discord}
                  onChange={(e) => handleFieldChange("discord", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FeeDisplay />
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Additional Actions</h2>
        <MarketIdCreator />
        <FreezeAuthorityRevoker />
        <MintAuthorityRevoker />
      </div>
    </div>
  );
};

export default TokenCreationForm;
