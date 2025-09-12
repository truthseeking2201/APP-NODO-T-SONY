// src/mocks/fixtures/vaults.ts
import type {
  DepositVaultConfig,
  WithdrawalRequests,
  VaultEstimateDeposit,
  VaultEstimateWithdraw,
  BasicVaultDetailsType,
  VaultEstimateWithdrawDual,
  VaultSwapDepositInfo,
} from "@/types/vault-config.types";
import { USDC_CONFIG, LP_TOKEN_CONFIG } from "@/config/coin-config";

const MOCK_VAULT_ID = "0xMOCK_VAULT_ID";
const MOCK_LP_TYPE = "0xMOCK::ndlp::NDLP";
const MOCK_COLLATERAL = USDC_CONFIG.coinType;

export const mockDepositVaults: DepositVaultConfig[] = [
  {
    id: 1,
    vault_id: MOCK_VAULT_ID,
    vault_module: "vault",
    apr: 12.3,
    apy: 12.9,
    reward_24h: 0,
    is_active: true,
    vault_lp_token: MOCK_LP_TYPE,
    vault_lp_token_decimals: LP_TOKEN_CONFIG.decimals ?? 6,
    collateral_token: MOCK_COLLATERAL,
    collateral_token_decimals: 6,
    vault_name: "NOVA • USDC",
    vault_address: "0xMOCK_VAULT_ADDR_NOVA",
    exchange_id: 1,
    total_value_usd: "123456789",
    rewards_24h_usd: "0",
    vault_apy: "12.9",
    user_balance_usd: 0,
    metadata: {
      package_id: "0xMOCK_PACK",
      vault_module: "vault",
      vault_config_id: "0xMOCK_CONFIG",
      exchange_id: 1,
      pool: "0xMOCK_POOL_ADDR",
    },
    pool: {
      pool_name: "NOVA/USDC Pool",
      pool_address: "0xMOCK_POOL_ADDR",
    } as any,
    tokens: [
      {
        token_id: 1,
        token_symbol: "USDC",
        token_name: "USDC",
        token_address: MOCK_COLLATERAL,
        decimal: 6,
        url: "",
        exchange_id: 1,
        min_deposit_amount: "0",
        min_deposit_amount_usd: "0",
        max_deposit_amount: "0",
      },
    ],
    ready: true,
  } as any,
];

export const mockVaultsWithdrawal: WithdrawalRequests[] = [
  {
    id: "REQ-001",
    vault_id: MOCK_VAULT_ID,
    user_reward_earned_usd: "0",
    withdrawals: [],
  },
];

export const mockBasicDetails: Record<string, BasicVaultDetailsType> = {
  [MOCK_VAULT_ID]: {
    id: "1",
    vault_id: MOCK_VAULT_ID,
    vault_name: "NOVA • USDC",
    vault_address: "0xMOCK_VAULT_ADDR_NOVA",
    vault_module: "vault",
    collateral_token: MOCK_COLLATERAL,
    collateral_token_decimals: 6,
    vault_lp_token: MOCK_LP_TYPE,
    vault_lp_token_decimals: LP_TOKEN_CONFIG.decimals ?? 6,
    total_value_usd: "123456789",
    vault_apy: "12.9",
    ndlp_price: "1",
    ndlp_price_usd: "1",
    ndlp_price_7d: "1",
    ndlp_price_change_7d: 0,
    user_break_even_price: 1,
    ndlp_price_change_24h: 0,
    ndlp_total_supply: "1000000000",
    rewards_24h_usd: "0",
    rewards_24h_daily_rate: 0,
    nodo_share: 0,
    management_fee: 0,
    performance_fee: 0,
    user_balance: 0,
    pool: {
      pool_id: 1,
      pool_name: "NOVA/USDC Pool",
      exchange_id: 1,
      fee_tier: "0.01%",
      pool_address: "0xMOCK_POOL_ADDR",
      pool_type: "uni-v3",
      token_a_address: MOCK_COLLATERAL,
      token_b_address: "0x2::sui::SUI",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    exchange: "nova",
    exchange_id: 1,
    tokens: [
      {
        token_id: 1,
        token_symbol: "USDC",
        token_name: "USDC",
        token_address: MOCK_COLLATERAL,
        decimal: 6,
        url: "",
        exchange_id: 1,
        min_deposit_amount: "0",
        min_deposit_amount_usd: "0",
      },
    ],
    reward_tokens: [],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {
      package_id: "0xMOCK_PACK",
      vault_module: "vault",
      vault_config_id: "0xMOCK_CONFIG",
      vault_id: MOCK_VAULT_ID,
      exchange_id: 1,
      withdraw_interval: 0,
      pool: "0xMOCK_POOL_ADDR",
      executor: {
        mmt: { config: "0xMOCK_EXEC_MMT", module: "mmt_adapter", address: "0xMOCK" },
        bluefin: { config: "0xMOCK_EXEC_BF", module: "bluefin_adapter", address: "0xMOCK" },
        cetus: { config: "0xMOCK_EXEC_CT", module: "cetus_adapter", address: "0xMOCK" },
      },
      is_enable_dual_token: true,
    },
    collateral_price_feed_id: "0xMOCK_PRICE_FEED",
    change_24h: [],
  } as any,
};

export const mockEstimateDeposit: VaultEstimateDeposit = {
  estimated_ndlp: "1000000",
  collateral_amount: "1000000",
  ndlp_per_deposit_rate: 1,
  ndlp_rate: 1,
};

export const mockEstimateWithdraw: VaultEstimateWithdraw = {
  estimated_payout_amount: "1000000",
  collateral_amount: "1000000",
  ndlp_per_payout_rate: 1,
  ndlp_rate: 1,
};

export const mockEstimateWithdrawDual: VaultEstimateWithdrawDual = {
  amount_a: "500000",
  amount_b: "500000",
  ndlp_rate: 1,
  collateral_amount: "1000000",
  collateral_in_usd: "1000000",
  price_a: "1",
  price_b: "1",
};

export const mockSwapDepositInfo: VaultSwapDepositInfo = {
  vault_package_id: "0xMOCK_PACK",
  vault_config: "0xMOCK_CONFIG",
  vault_id: MOCK_VAULT_ID,
  vault_collateral_token: MOCK_COLLATERAL,
  vault_lp_token: MOCK_LP_TYPE,
  pool_address: "0xMOCK_POOL_ADDR",
  pool_token_a_type: MOCK_COLLATERAL,
  pool_token_b_type: "0x2::sui::SUI",
  vault_package_module: "mmt_adapter",
  vault_package_function: "deposit",
  global_config: "0xMOCK_GLOBAL",
  version: "1",
};

export const mockUserHolding = {
  // Used by "Estimated LP Breakdown"
  vault_id: MOCK_VAULT_ID,
  user_wallet: "0xMOCK_WALLET",
  code: "OK",
  timestamp: new Date().toISOString(),
  user_ndlp_balance: 1000000,
  ndlp_price: "1",
  ndlp_price_usd: "1",
  user_total_liquidity_usd: 1000000,
  user_total_rewards_usd: 0,
  user_total_deposit: 1000000,
  user_total_deposit_usd: 1000000,
  user_rewards_24h_usd: 0,
  user_shares_percent: 100,
  user_break_event_price: 1,
  user_break_event_price_usd: 1,
  user_total_withdraw_usd: 0,
  user_vault_tokens: [
    { token_symbol: "USDC", token_name: "USDC", amount: 600000, amount_in_usd: 600000, percent_change: 0 },
    { token_symbol: "SUI", token_name: "SUI", amount: 300000, amount_in_usd: 300000, percent_change: 0 },
    { token_symbol: "DEEP", token_name: "DEEP", amount: 100000, amount_in_usd: 100000, percent_change: 0 },
  ],
  user_vault_rewards: [],
};

export const mockVaultActivitiesPage = {
  total: 3,
  items: [
    {
      id: "tx1",
      action_type: "ADD_LIQUIDITY",
      amount_in_usd: 25000,
      created_at: new Date().toISOString(),
      hash: "0xMOCKADD",
    },
    {
      id: "tx2",
      action_type: "SWAP",
      amount_in_usd: 5000,
      created_at: new Date().toISOString(),
      hash: "0xMOCKSWAP",
    },
    {
      id: "tx3",
      action_type: "REMOVE_LIQUIDITY",
      amount_in_usd: 12500,
      created_at: new Date().toISOString(),
      hash: "0xMOCKREMOVE",
    },
  ],
};

export const mockVaultAnalytics = {
  histogram_type: "price",
  histogram_range: "7D",
  data: Array.from({ length: 30 }).map((_, i) => ({
    ts: Date.now() - i * 60 * 60 * 1000,
    ndlp_price: 1.0 + 0.01 * Math.sin(i / 3),
    tvl: 120_000_000 + i * 10_000,
    price_a: 1.0 + 0.01 * Math.cos(i / 4),
    price_b: 1.0 + 0.015 * Math.sin(i / 5),
    apy: 12 + Math.sin(i / 8),
  })),
};

