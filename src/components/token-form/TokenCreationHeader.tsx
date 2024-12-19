import WalletConnect from "../WalletConnect";

export const TokenCreationHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold">Create Token</h3>
      <WalletConnect label="Connect to Create Token" />
    </div>
  );
};