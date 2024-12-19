import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Connection } from "@solana/web3.js";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      // Check if any Solana wallet is available
      const { solana } = window;
      
      if (!solana) {
        toast({
          variant: "destructive",
          title: "Wallet Not Found",
          description: "Please install Phantom or Solflare wallet",
        });
        // Open Phantom wallet website in a new tab
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // Create connection to Solana mainnet
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

      // This will trigger the wallet selector if multiple wallets are installed
      const resp = await solana.connect();
      const publicKey = resp.publicKey.toString();
      
      // Verify connection by checking wallet balance
      const balance = await connection.getBalance(resp.publicKey);
      console.log("Connected to wallet:", publicKey);
      console.log("Wallet balance:", balance / 1e9, "SOL");

      setConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
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
          <span className="ml-4">Connected</span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default WalletConnect;