import { Button } from "@/components/ui/button";

interface ConnectedWalletProps {
  publicKey: string | null;
  onDisconnect: () => void;
}

const ConnectedWallet = ({ publicKey, onDisconnect }: ConnectedWalletProps) => {
  return (
    <Button
      variant="secondary"
      onClick={onDisconnect}
      className="relative min-w-[140px] justify-center"
    >
      <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
      <span className="ml-4">
        {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Connected'}
      </span>
    </Button>
  );
};

export default ConnectedWallet;