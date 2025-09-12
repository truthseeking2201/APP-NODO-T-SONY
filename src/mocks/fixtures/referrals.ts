// src/mocks/fixtures/referrals.ts
export const mockWalletDetail = {
  email: null,
  status: "active",
  wallet_provider: "MockWallet",
  wallet_address: "0xMOCK_WALLET",
  timestamp: new Date().toISOString(),
  metadata: null,
  invite_code: { code: "NODO-MOCK" },
  total_referrals: 42,
};

export const mockAffiliateDashboard = {
  invite_code: "NODO-MOCK",
  total_referrals: 42,
  total_volume_usd: 9876543,
  rewards_usd: 1234.56,
  referrals: [
    { wallet_address: "0xREF1", joined_at: "2024-03-01T00:00:00Z" },
    { wallet_address: "0xREF2", joined_at: "2024-04-10T00:00:00Z" },
  ],
};

