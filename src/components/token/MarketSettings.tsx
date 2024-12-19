import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarketSettingsProps {
  formData: {
    minOrderSize: string;
    tickSize: string;
  };
  setFormData: (data: any) => void;
}

const MarketSettings = ({ formData, setFormData }: MarketSettingsProps) => {
  return (
    <div className="grid gap-2">
      <Label>Market Configuration</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minOrderSize">Min Order Size Setting</Label>
          <Input
            id="minOrderSize"
            type="number"
            value={formData.minOrderSize}
            onChange={(e) =>
              setFormData({ ...formData, minOrderSize: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="tickSize">Tick Size Setting</Label>
          <Input
            id="tickSize"
            type="number"
            value={formData.tickSize}
            onChange={(e) =>
              setFormData({ ...formData, tickSize: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MarketSettings;