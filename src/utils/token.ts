import { clusterApiUrl } from '@solana/web3.js';

export const NETWORK = 'devnet';
export const FEE_RECEIVER = '2xhN9UyGhWyvFWMXJKKHCQBHbCcnKEiJ1oKxRb6NGrYe';
export const FEE_AMOUNT = 30000000; // 0.03 SOL in lamports

// List of backup RPC endpoints
export const RPC_ENDPOINTS = [
  clusterApiUrl('devnet'),
  'https://api.devnet.solana.com',
  'https://devnet.genesysgo.net',
];

// Delay between retries (in milliseconds)
export const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff