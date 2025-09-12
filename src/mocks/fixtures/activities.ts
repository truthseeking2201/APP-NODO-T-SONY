// src/mocks/fixtures/activities.ts
export type Activity = {
  id: string;
  vault_id: string;
  action_type: 'ADD_LIQUIDITY' | 'REMOVE_LIQUIDITY' | 'SWAP';
  amount_in_usd: number;
  created_at: string; // ISO
  hash: string;
  status: 'success' | 'pending' | 'failed';
};

export const mockActivities: Activity[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `tx${i + 1}`,
  vault_id: 'nodo-nova-usdc',
  action_type: (['ADD_LIQUIDITY', 'SWAP', 'REMOVE_LIQUIDITY'] as const)[i % 3],
  amount_in_usd: 1000 + i * 123,
  created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  hash: `0xMOCK${(i + 1).toString(16).padStart(4, '0')}`,
  status: i % 11 === 0 ? 'failed' : i % 5 === 0 ? 'pending' : 'success',
}));

