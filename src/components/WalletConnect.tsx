import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      if (!window.solana) {
        toast({
          variant: "destructive",
          title: "Wallet not found",
          description: "Please install Phantom wallet",
        });
        return;
      }

      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      setAddress(address);
      setConnected(true);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.slice(0, 4)}...${address.slice(-4)}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect wallet",
      });
    }
  };

  const disconnectWallet = async () => {
    if (window.solana) {
      await window.solana.disconnect();
      setConnected(false);
      setAddress(null);
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={connected ? disconnectWallet : connectWallet}
    >
      <Wallet className="h-4 w-4" />
      {connected ? `${address?.slice(0, 4)}...${address?.slice(-4)}` : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;