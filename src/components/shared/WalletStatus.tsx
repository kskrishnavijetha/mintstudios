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
    <div className="flex items-center justify-end space-x-2">
      {walletAddress && (
        <span className="text-sm text-muted-foreground">
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </span>
      )}
      <WalletConnect />
    </div>
  );
};