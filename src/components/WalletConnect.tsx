import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleWalletChange = () => {
      if (window.solana?.isConnected) {
        setConnected(true);
        setAddress(window.solana.publicKey?.toString() || null);
      } else {
        setConnected(false);
        setAddress(null);
      }
    };

    window.solana?.on("connect", handleWalletChange);
    window.solana?.on("disconnect", handleWalletChange);
    window.solana?.on("accountChanged", handleWalletChange);

    // Check initial connection state
    handleWalletChange();

    return () => {
      window.solana?.removeAllListeners("connect");
      window.solana?.removeAllListeners("disconnect");
      window.solana?.removeAllListeners("accountChanged");
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window === "undefined") return;

      let wallet = window.solana;

      if (!wallet && window.solflare) {
        wallet = window.solflare;
      }

      if (!wallet) {
        toast({
          variant: "destructive",
          title: "Wallet not found",
          description: "Please install Phantom or Solflare wallet",
        });
        window.open("https://phantom.app/", "_blank");
        window.open("https://solflare.com/", "_blank");
        return;
      }

      const response = await wallet.connect();
      const address = response.publicKey.toString();
      setAddress(address);
      setConnected(true);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.slice(0, 4)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      let wallet = window.solana || window.solflare;
      if (wallet) {
        await wallet.disconnect();
        setConnected(false);
        setAddress(null);
        toast({
          title: "Wallet disconnected",
          description: "Your wallet has been disconnected",
        });
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        variant: "destructive",
        title: "Disconnect failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={connected ? disconnectWallet : connectWallet}
      disabled={isConnecting}
    >
      <Wallet className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
      {isConnecting 
        ? "Connecting..." 
        : connected 
          ? `${address?.slice(0, 4)}...${address?.slice(-4)}`
          : "Connect Wallet"
      }
    </Button>
  );
};

export default WalletConnect;