import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";

interface TokenDetailsProps {
  formData: {
    description: string;
    image: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
}

export const TokenDetails = ({ 
  formData, 
  onFieldChange, 
  onImageUpload, 
  selectedImage 
}: TokenDetailsProps) => {
  return (
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
                onChange={onImageUpload}
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
          onChange={(e) => onFieldChange("description", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};