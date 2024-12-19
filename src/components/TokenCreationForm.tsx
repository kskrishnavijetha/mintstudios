import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    minOrderSize: "0",
    tickSize: "6",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate token creation - in reality, you'd connect to Solana here
    // and send fees to 91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi
    setTimeout(() => {
      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  const getRecommendedSizes = (supply: number) => {
    if (supply <= 100000) return { minOrder: "0.01", tick: "0.0001", minOrderSetting: "2", tickSetting: "4" };
    if (supply <= 1000000) return { minOrder: "0.1", tick: "0.00001", minOrderSetting: "1", tickSetting: "5" };
    if (supply <= 10000000) return { minOrder: "1", tick: "0.000001", minOrderSetting: "0", tickSetting: "6" };
    if (supply <= 100000000) return { minOrder: "10", tick: "0.0000001", minOrderSetting: "-1", tickSetting: "7" };
    if (supply <= 1000000000) return { minOrder: "100", tick: "0.00000001", minOrderSetting: "-2", tickSetting: "8" };
    if (supply <= 10000000000) return { minOrder: "1000", tick: "0.000000001", minOrderSetting: "-3", tickSetting: "9" };
    return { minOrder: "10000", tick: "0.0000000001", minOrderSetting: "-4", tickSetting: "10" };
  };

  const handleSupplyChange = (value: string) => {
    const supply = Number(value);
    const recommended = getRecommendedSizes(supply);
    setFormData(prev => ({
      ...prev,
      supply: value,
      minOrderSize: recommended.minOrderSetting,
      tickSize: recommended.tickSetting
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            placeholder="My Token"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            placeholder="MTK"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, decimals: e.target.value })
            }
            required
          />
        </div>

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

        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-medium mb-2">Recommended Market Settings</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Supply</TableHead>
                <TableHead>Min Order Size</TableHead>
                <TableHead>Tick Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>≤ 100k</TableCell>
                <TableCell>0.01 (2)</TableCell>
                <TableCell>0.0001 (4)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>≤ 1M</TableCell>
                <TableCell>0.1 (1)</TableCell>
                <TableCell>0.00001 (5)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>≤ 10M</TableCell>
                <TableCell>1 (0)</TableCell>
                <TableCell>0.000001 (6)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>≤ 100M</TableCell>
                <TableCell>10 (-1)</TableCell>
                <TableCell>0.0000001 (7)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Creation Fee: <span className="text-foreground">0.03 SOL</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Fee recipient: 91yc6aE5JeW7LLPyUk98ZXhDz27Dj2C6KbKnhLbujBDi
          </p>
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            "Create Token"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TokenCreationForm;