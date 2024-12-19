import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import WalletConnect from "../WalletConnect";

export const MarketIdCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    baseToken: "",
    minOrderSize: "",
    tickSize: "",
  });

  const handleCreate = async () => {
    setIsLoading(true);
    // Simulate market ID creation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Create Openbook Market ID</h3>
        <span className="text-sm text-muted-foreground">Fee: 0.03 SOL</span>
      </div>

      <div className="flex justify-end">
        <WalletConnect />
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="baseToken">Base Token</Label>
          <Input
            id="baseToken"
            placeholder="Enter base token address"
            value={formData.baseToken}
            onChange={(e) => handleChange("baseToken", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="minOrderSize">Minimum Order Size</Label>
          <Input
            id="minOrderSize"
            type="number"
            placeholder="Enter minimum order size"
            value={formData.minOrderSize}
            onChange={(e) => handleChange("minOrderSize", e.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            For min order size 0.01 enter 2, for 0.1 enter 1, for 1 enter 0, for 10 enter -1, for 100 enter -2
          </span>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tickSize">Tick Size</Label>
          <Input
            id="tickSize"
            type="number"
            placeholder="Enter tick size"
            value={formData.tickSize}
            onChange={(e) => handleChange("tickSize", e.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            For tick size 0.0001 enter 4, for 0.00001 enter 5, for 0.000001 enter 6, for 0.0000001 enter 7
          </span>
        </div>
      </div>

      <Button 
        onClick={handleCreate} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Market ID...
          </>
        ) : (
          "Create Market ID"
        )}
      </Button>
    </div>
  );
};