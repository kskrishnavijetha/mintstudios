import { FormField } from "./FormField";

interface BasicInformationProps {
  formData: {
    name: string;
    symbol: string;
    supply: string;
    decimals: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

export const BasicInformation = ({ formData, onFieldChange }: BasicInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <FormField
        id="name"
        label="Token Name"
        placeholder="My Token"
        value={formData.name}
        onChange={(value) => onFieldChange("name", value)}
        required
      />

      <FormField
        id="symbol"
        label="Token Symbol"
        placeholder="MTK"
        value={formData.symbol}
        onChange={(value) => onFieldChange("symbol", value)}
        required
      />

      <FormField
        id="supply"
        label="Total Supply"
        type="number"
        placeholder="1000000"
        value={formData.supply}
        onChange={(value) => onFieldChange("supply", value)}
        required
      />

      <FormField
        id="decimals"
        label="Decimals"
        type="number"
        value={formData.decimals}
        onChange={(value) => onFieldChange("decimals", value)}
        required
      />
    </div>
  );
};