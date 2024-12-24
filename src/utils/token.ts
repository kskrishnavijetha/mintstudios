import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export const NETWORK = 'mainnet-beta';
export const FEE_RECEIVER = 'DxMLxKxN3CqPh8Vc3GQqvDn6wkKtYMtEKpM2EZA5HGXS';
export const FEE_AMOUNT = 30000000; // 0.03 SOL in lamports