import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const TokenCreationForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate token creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Token Created Successfully!",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
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
            onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
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
    </form>
  );
};

export default TokenCreationForm;