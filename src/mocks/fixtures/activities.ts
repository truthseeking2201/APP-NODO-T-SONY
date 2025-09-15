// src/mocks/fixtures/activities.ts
export type Activity = {
  id: string;
  vault_id: string;
  action_type:
    | 'ADD_LIQUIDITY'
    | 'REMOVE_LIQUIDITY'
    | 'SWAP'
    | 'SUPPLY'
    | 'BORROW'
    | 'REPAY'
    | 'UNWIND';
  amount_in_usd: number;
  created_at: string; // ISO
  hash: string;
  status: 'success' | 'pending' | 'failed';
  token_in?: string;
  token_out?: string;
};

// Distribute 50 rows across Add/Swap/Remove and Looping (SUPPLY, BORROW, REPAY, UNWIND)
const TYPES: Activity['action_type'][] = [
  'ADD_LIQUIDITY',
  'SWAP',
  'REMOVE_LIQUIDITY',
  'SUPPLY',
  'BORROW',
  'REPAY',
  'UNWIND',
];

export const mockActivities: Activity[] = Array.from({ length: 50 }).map((_, i) => {
  const t = TYPES[i % TYPES.length];
  const isSwap = t === 'SWAP';
  return {
    id: `tx_${i + 1}`,
    vault_id: 'nodo-nova-usdc',
    action_type: t,
    amount_in_usd: 1000 + i * 111,
    created_at: new Date(Date.now() - i * 36 * 60 * 1000).toISOString(),
    hash: `0xMOCK${(i + 1).toString(16).padStart(4, '0')}`,
    status: i % 11 === 0 ? 'failed' : i % 5 === 0 ? 'pending' : 'success',
    token_in: isSwap ? (i % 2 === 0 ? 'USDC' : 'SUI') : undefined,
    token_out: isSwap ? (i % 2 === 0 ? 'SUI' : 'USDC') : undefined,
  } as Activity;
});
