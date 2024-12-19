import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Connection, PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { solana } = window;
        if (solana?.isPhantom && solana.isConnected) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setConnected(true);
          setPublicKey(response.publicKey.toString());
        }
      } catch (error) {
        console.error("Auto-connect error:", error);
        setConnected(false);
        setPublicKey(null);
      }
    };

    // Check connection status when component mounts
    checkWalletConnection();

    // Listen for wallet connection changes
    window.solana?.on('connect', () => {
      checkWalletConnection();
    });

    window.solana?.on('disconnect', () => {
      setConnected(false);
      setPublicKey(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    });

    // Cleanup listeners
    return () => {
      window.solana?.removeAllListeners('connect');
      window.solana?.removeAllListeners('disconnect');
    };
  }, [toast]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const { solana } = window;
      
      if (!solana?.isPhantom) {
        toast({
          variant: "destructive",
          title: "Wallet Not Found",
          description: "Please install Phantom wallet",
        });
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const resp = await solana.connect();
      const walletPubKey = new PublicKey(resp.publicKey.toString());
      const walletAddress = walletPubKey.toString();
      
      try {
        const balance = await connection.getBalance(walletPubKey);
        console.log("Connected to wallet:", walletAddress);
        console.log("Wallet balance:", balance / 1e9, "SOL");
      } catch (error) {
        console.error("Error fetching balance:", error);
      }

      setConnected(true);
      setPublicKey(walletAddress);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { solana } = window;
      if (solana) {
        await solana.disconnect();
        setConnected(false);
        setPublicKey(null);
        
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet. Please try again.",
      });
    }
  };

  return (
    <Button
      variant={connected ? "secondary" : "default"}
      onClick={connected ? handleDisconnect : handleConnect}
      disabled={connecting}
      className="relative min-w-[140px] justify-center"
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : connected ? (
        <>
          <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-4">
            {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Connected'}
          </span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default WalletConnect;