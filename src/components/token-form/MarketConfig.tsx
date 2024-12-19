import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketConfigProps {
  supply: string;
  onConfigChange: (minOrderSize: number, tickSize: number) => void;
}

export const MarketConfig = ({ supply, onConfigChange }: MarketConfigProps) => {
  const [minOrderSizeConfig, setMinOrderSizeConfig] = useState(0);
  const [tickSizeConfig, setTickSizeConfig] = useState(4);

  const marketConfigs = [
    { supply: 100_000, minOrder: "0.01", tick: "0.0001", minOrderConfig: 2, tickConfig: 4 },
    { supply: 1_000_000, minOrder: "0.1", tick: "0.00001", minOrderConfig: 1, tickConfig: 5 },
    { supply: 10_000_000, minOrder: "1", tick: "0.000001", minOrderConfig: 0, tickConfig: 6 },
    { supply: 100_000_000, minOrder: "10", tick: "0.0000001", minOrderConfig: -1, tickConfig: 7 },
    { supply: 1_000_000_000, minOrder: "100", tick: "0.00000001", minOrderConfig: -2, tickConfig: 8 },
    { supply: 10_000_000_000, minOrder: "1,000", tick: "0.000000001", minOrderConfig: -3, tickConfig: 9 },
    { supply: 100_000_000_000, minOrder: "10,000", tick: "0.0000000001", minOrderConfig: -4, tickConfig: 10 },
  ];

  useEffect(() => {
    const supplyNum = Number(supply) || 0;
    const config = marketConfigs.find((c, index, arr) => {
      const nextConfig = arr[index + 1];
      return supplyNum <= c.supply || !nextConfig;
    }) || marketConfigs[0];

    setMinOrderSizeConfig(config.minOrderConfig);
    setTickSizeConfig(config.tickConfig);
    onConfigChange(config.minOrderConfig, config.tickConfig);
  }, [supply, onConfigChange]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>Market ID Configuration:</p>
        <p>Min Order Size Setting: {minOrderSizeConfig}</p>
        <p>Tick Size Setting: {tickSizeConfig}</p>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token Supply</TableHead>
              <TableHead>Min Order Size</TableHead>
              <TableHead>Tick Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketConfigs.map((config) => (
              <TableRow key={config.supply}>
                <TableCell>{config.supply.toLocaleString()}</TableCell>
                <TableCell>{config.minOrder}</TableCell>
                <TableCell>{config.tick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};