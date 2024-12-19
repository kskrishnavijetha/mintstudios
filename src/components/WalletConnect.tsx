import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      if (!window?.solana) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // This will trigger the wallet selector if multiple wallets are installed
      await window.solana.connect();
      setConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to wallet",
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