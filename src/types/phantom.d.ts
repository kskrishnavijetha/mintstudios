interface Window {
  solana?: {
    connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    isPhantom?: boolean;
    isSolflare?: boolean;
    isConnected?: boolean;
    publicKey?: { toString: () => string };
    on: (event: string, callback: () => void) => void;
    removeAllListeners: (event: string) => void;
  };
}