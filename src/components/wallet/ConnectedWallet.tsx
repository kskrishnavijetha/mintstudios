import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectedWalletProps {
  publicKey: string | null;
  onDisconnect: () => void;
  label?: string;
}

const ConnectedWallet = ({ publicKey, onDisconnect, label = "Connected" }: ConnectedWalletProps) => {
  const { toast } = useToast();

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

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
          onClick={handleCopyAddress}
          className="cursor-pointer flex items-center"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => window.open("https://phantom.app/", "_blank")}
          className="cursor-pointer flex items-center"
        >
          <User className="mr-2 h-4 w-4" />
          Change Wallet
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDisconnect}
          className="cursor-pointer text-destructive flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedWallet;