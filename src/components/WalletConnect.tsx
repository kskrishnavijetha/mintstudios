import { useState } from "react";
import { Button } from "@/components/ui/button";

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    // In reality, you'd implement actual wallet connection here
    setConnected(true);
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