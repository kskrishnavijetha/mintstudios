import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectedWalletProps {
  publicKey: string | null;
  onDisconnect: () => void;
  label?: string;
}

const ConnectedWallet = ({ publicKey, onDisconnect, label = "Connected" }: ConnectedWalletProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="relative min-w-[140px] justify-center"
        >
          <span className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-4">
            {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-popover">
        <DropdownMenuItem 
          onClick={onDisconnect}
          className="cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedWallet;