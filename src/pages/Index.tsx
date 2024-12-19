import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TokenCreationForm from "@/components/TokenCreationForm";
import WalletConnect from "@/components/WalletConnect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen relative">
      <div className="absolute top-4 right-4">
        <WalletConnect />
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-solana-purple to-solana-blue bg-clip-text text-transparent">
            Solana Token Creator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create your own SPL token on Solana blockchain at just 0.03 SOL
          </p>
        </div>

        <div className="glass-card p-6 space-y-6">
          <h2 className="text-2xl font-semibold">How to Use Solana Token Creator</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Connect your Solana wallet</li>
            <li>Specify the desired name for your Token</li>
            <li>Indicate the symbol (max 8 characters)</li>
            <li>Determine the Supply of your Token</li>
            <li>Select the decimals quantity (default recommended 9 for all tokens)</li>
            <li>Upload the image for your token</li>
            <li>Provide a brief description for your SPL Token</li>
            <li>Add Website, Twitter, Telegram, Discord</li>
            <li>Click on create, accept the transaction and wait until your tokens are ready</li>
          </ol>
        </div>

        <Card className="glass-card p-6">
          <TokenCreationForm />
        </Card>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is an SPL Token?</AccordionTrigger>
              <AccordionContent>
                SPL Tokens are the Solana equivalent of ERC-20 tokens on Ethereum. They are fungible tokens that can represent anything from cryptocurrencies to in-game items, loyalty points, or shares in a project.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How much SOL do I need to create a token?</AccordionTrigger>
              <AccordionContent>
                You need approximately 0.03 SOL to create a token. This covers the transaction fees and storage costs on the Solana blockchain. Make sure you have some extra SOL for future transactions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What are token decimals?</AccordionTrigger>
              <AccordionContent>
                Decimals determine how divisible your token is. For example, if you set decimals to 9, your token can be divided into 0.000000001 units. Most tokens use 9 decimals, similar to SOL, but you can choose any number between 0-9 based on your needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I modify my token after creation?</AccordionTrigger>
              <AccordionContent>
                While the core parameters like total supply and decimals cannot be changed after creation, you can update the metadata like name, symbol, and images. You can also mint more tokens if you retain the mint authority.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is my token automatically listed on exchanges?</AccordionTrigger>
              <AccordionContent>
                No, creating a token doesn't automatically list it on exchanges. You'll need to apply separately to exchanges and meet their listing requirements. However, your token can be traded on decentralized exchanges (DEX) once you provide liquidity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Powered by Solana blockchain
        </p>
      </div>
    </div>
  );
};

export default Index;