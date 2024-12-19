import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";

const WalletStatus = () => {
  const { connected, connect, disconnect, publicKey } = useWallet();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <Button
      variant={connected ? "secondary" : "default"}
      onClick={handleClick}
      className="relative"
    >
      {connected ? (
        <>
          <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-4">
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};

export default WalletStatus;