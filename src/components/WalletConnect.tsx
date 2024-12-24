import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const WalletConnect = () => {
  const { connected, wallet } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (wallet?.adapter.network !== 'devnet' && connected) {
      toast({
        variant: "destructive",
        title: "Network Mismatch",
        description: "Please switch your wallet network to devnet to continue.",
      });
    }
  }, [wallet?.adapter.network, connected, toast]);

  return (
    <div className="relative">
      <WalletMultiButton className={`${
        connected 
          ? "bg-secondary hover:bg-secondary/90" 
          : "bg-primary hover:bg-primary/90"
        } text-white font-bold py-2 px-4 rounded relative flex items-center gap-2`
      }>
        {connected && (
          <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
        )}
        {connected ? "Connected" : "Connect Wallet"}
      </WalletMultiButton>
    </div>
  );
};

export default WalletConnect;