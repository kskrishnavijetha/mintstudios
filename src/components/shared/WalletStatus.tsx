import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "../WalletConnect";

export const useWalletStatus = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkWalletStatus = () => {
      const { solana } = window;
      if (solana?.isConnected && solana?.publicKey) {
        setWalletAddress(solana.publicKey.toString());
      } else {
        setWalletAddress(null);
      }
    };

    window.solana?.on('connect', checkWalletStatus);
    window.solana?.on('disconnect', checkWalletStatus);
    checkWalletStatus();

    return () => {
      window.solana?.removeAllListeners('connect');
      window.solana?.removeAllListeners('disconnect');
    };
  }, []);

  return { walletAddress };
};

export const WalletStatus = () => {
  const { walletAddress } = useWalletStatus();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {walletAddress ? (
            <>Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</>
          ) : (
            'Not Connected'
          )}
        </span>
        <WalletConnect />
      </div>
    </div>
  );
};