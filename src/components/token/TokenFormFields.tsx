import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TokenFormFieldsProps {
  formData: {
    name: string;
    symbol: string;
    supply: string;
    decimals: string;
    minOrderSize: string;
    tickSize: string;
  };
  setFormData: (data: any) => void;
  handleSupplyChange: (value: string) => void;
}

const TokenFormFields = ({ formData, setFormData, handleSupplyChange }: TokenFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Token Name</Label>
        <Input
          id="name"
          placeholder="My Token"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="symbol">Token Symbol</Label>
        <Input
          id="symbol"
          placeholder="MTK"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="supply">Total Supply</Label>
        <Input
          id="supply"
          type="number"
          placeholder="1000000"
          value={formData.supply}
          onChange={(e) => handleSupplyChange(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="decimals">Decimals</Label>
        <Input
          id="decimals"
          type="number"
          value={formData.decimals}
          onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default TokenFormFields;