interface Phantom {
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isPhantom?: boolean;
  isSolflare?: boolean;
  isConnected?: boolean;
  publicKey?: { toString: () => string };
  on: (event: string, callback: () => void) => void;
  removeAllListeners: (event: string) => void;
  signAndSendTransaction: (transaction: import("@solana/web3.js").Transaction) => Promise<string>;
}

interface Window {
  solana?: Phantom;
}