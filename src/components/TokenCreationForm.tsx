import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FormField } from "./token-form/FormField";
import { FeeDisplay } from "./token-form/FeeDisplay";
import { SubmitButton } from "./token-form/SubmitButton";
import { MarketConfig } from "./token-form/MarketConfig";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    minOrderSize: 0,
    tickSize: 4,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate token creation - in reality, you'd connect to Solana here
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

  const handleMarketConfigChange = (minOrderSize: number, tickSize: number) => {
    setFormData(prev => ({
      ...prev,
      minOrderSize,
      tickSize,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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

        <MarketConfig 
          supply={formData.supply}
          onConfigChange={handleMarketConfigChange}
        />
      </div>

      <div className="space-y-4">
        <FeeDisplay />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default TokenCreationForm;