import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment
window.Buffer = Buffer;

export const NETWORK = "mainnet-beta";
export const FEE_RECEIVER = "7ncEMe17aMHcn87SrVHHUprwE7N455tysFCjhSjoFaRk";
export const FEE_AMOUNT = 0.03 * 1000000000; // 0.03 SOL in lamports