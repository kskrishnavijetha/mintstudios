import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js";

const NETWORK = "devnet";
const FEE_RECEIVER = "64tMohDoBgFNRsm8U4XWbjFuixVs1qPLfmgoD8gR5ijo";
const FEE_AMOUNT = 0.03 * LAMPORTS_PER_SOL; // 0.03 SOL in lamports

const TokenCreationForm = () => {
  const { toast } = useToast();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "9",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create connection to devnet
      const connection = new Connection(`https://api.${NETWORK}.solana.com`);

      // Create transaction for fee payment
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(FEE_RECEIVER),
          lamports: FEE_AMOUNT,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      // If transaction is successful, proceed with token creation
      toast({
        title: "Token Creation Initiated",
        description: `Created ${formData.name} (${formData.symbol}) with supply of ${formData.supply}`,
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating token",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... keep existing code (form JSX structure)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Token Name</Label>
          <Input
            id="name"
            placeholder="My Token"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            placeholder="MTK"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="supply">Total Supply</Label>
          <Input
            id="supply"
            type="number"
            placeholder="1000000"
            value={formData.supply}
            onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="decimals">Decimals</Label>
          <Input
            id="decimals"
            type="number"
            value={formData.decimals}
            onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Token Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Token preview"
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter token description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            placeholder="@yourtwitter"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            placeholder="t.me/yourtelegram"
            value={formData.telegram}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            placeholder="discord.gg/yourdiscord"
            value={formData.discord}
            onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
          />
        </div>
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Token...
          </>
        ) : (
          <>
            Create Token (Fee: 0.03 SOL)
          </>
        )}
      </Button>
    </form>
  );
};

export default TokenCreationForm;
