import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Connection, PublicKey } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Phantom Wallet is installed
    const checkPhantomWallet = () => {
      const isPhantomInstalled = window.phantom?.solana?.isPhantom;
      if (!isPhantomInstalled) {
        toast({
          variant: "destructive",
          title: "Wallet not found",
          description: "Please install Phantom wallet to continue",
        });
      }
    };

    checkPhantomWallet();
  }, [toast]);

  const handleConnect = async () => {
    try {
      const { solana } = window as any;

      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const response = await solana.connect();
      const publicKey = new PublicKey(response.publicKey.toString());
      
      // Verify the connection
      const balance = await connection.getBalance(publicKey);
      console.log("Wallet balance:", balance / 1e9, "SOL");

      setPublicKey(publicKey.toString());
      setConnected(true);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
      });
      setConnected(false);
    }
  };

  return (
    <Button
      variant={connected ? "secondary" : "default"}
      onClick={handleConnect}
      className="relative"
    >
      {connected ? (
        <>
          <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-4">
            {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "Connected"}
          </span>
        </>
      ) : (
        "Connect Phantom"
      )}
    </Button>
  );
};

export default WalletConnect;