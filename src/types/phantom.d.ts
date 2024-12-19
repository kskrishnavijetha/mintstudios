interface Window {
  solana?: {
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    isPhantom?: boolean;
    isSolflare?: boolean;
  };
}