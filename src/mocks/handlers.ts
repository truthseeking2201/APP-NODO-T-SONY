// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import {
  mockDepositVaults,
  mockVaultsWithdrawal,
  mockBasicDetails,
  mockEstimateDeposit,
  mockEstimateWithdraw,
  mockEstimateWithdrawDual,
  mockUserHolding,
  mockVaultActivitiesPage,
  mockVaultAnalytics,
  mockSwapDepositInfo,
} from "./fixtures/vaults";
import { mockWalletDetail, mockAffiliateDashboard } from "./fixtures/referrals";

const ok = (data: any) => HttpResponse.json({ data });

export const handlers = [
  // ---- Auth
  http.post("/data-management/auth/login", async () => {
    return ok({
      access_token: "MOCK_ACCESS_TOKEN",
      refresh_token: "MOCK_REFRESH_TOKEN",
    });
  }),
  http.post("/data-management/auth/refresh", async () => {
    return ok({ access_token: "MOCK_ACCESS_TOKEN_REFRESHED", refresh_token: "MOCK_REFRESH_TOKEN" });
  }),

  // ---- Wallet / Referrals
  http.get("/data-management/external/user/wallet-detail", async () => ok(mockWalletDetail)),
  http.post("/data-management/external/user/subscribe", async () => ok({ success: true })),
  http.post("/data-management/external/user/update-wallet-provider", async () => ok({ success: true })),
  http.post("/data-management/external/user/invite-code", async () => ok({ success: true })),
  http.post("/data-management/external/user/skip-invite-code", async () => ok({ success: true })),
  http.get("/data-management/external/user/my-affiliate-dashboard", async () => ok(mockAffiliateDashboard)),

  // ---- Vaults: lists & details
  http.get("/data-management/external/vaults/list", async () => ok(mockDepositVaults)),
  http.get("/data-management/external/vaults/withdrawals", async () => ok(mockVaultsWithdrawal)),
  http.get("/data-management/external/vaults/:vaultId/basic", async ({ params }) => {
    const vaultId = params.vaultId as string;
    const base = mockBasicDetails[vaultId] ?? mockBasicDetails[Object.keys(mockBasicDetails)[0]];
    return ok(base);
  }),

  // Profit/signature data used for deposit/withdraw flows
  http.get("/data-management/external/vaults/:vaultId/profit-data", async () =>
    ok({
      signature: "abcdef012345",
      signer_publickey: "012345abcdef",
      vault_value: 1000000,
      profit_amount: 0,
      negative: false,
      expire_time: Math.floor(Date.now() / 1000) + 3600,
      last_credit_time: Math.floor(Date.now() / 1000) - 3600,
    })
  ),

  // ---- Vaults: estimates & swaps (deposit/withdraw flow)
  http.get("/data-management/external/vaults/:vaultId/estimate-deposit", async () => ok(mockEstimateDeposit)),
  http.get("/data-management/external/vaults/:vaultId/estimate-deposit-dual", async () => ok(mockEstimateWithdrawDual)),
  http.get("/data-management/external/vaults/:vaultId/estimate-withdraw", async () => ok(mockEstimateWithdraw)),
  http.get("/data-management/external/vaults/:vaultId/estimate-withdraw-dual", async () => ok(mockEstimateWithdrawDual)),
  http.get("/data-management/external/vaults/:vaultId/swap-and-deposit-info", async () => ok(mockSwapDepositInfo)),

  // ---- Activities (with filters + pagination)
  
  // Override Activities with filters + pagination
  http.get("/data-management/external/position-requests", async ({ request }) => {
    try {
      const { mockActivities } = await import("./fixtures/activities");
      const url = new URL(request.url);
      const vaultId = url.searchParams.get("vault_id") ?? "nodo-nova-usdc";
      const action = url.searchParams.get("action_type") ?? "";
      const page = parseInt(url.searchParams.get("page") ?? "1", 10);
      const limit = parseInt(url.searchParams.get("limit") ?? "25", 10);
  
      let rows = mockActivities.filter((a) => a.vault_id === vaultId);
      if (action) rows = rows.filter((a) => a.action_type === (action as any));
  
      const total = rows.length;
      const start = (page - 1) * limit;
      const items = rows.slice(start, start + limit).map((r) => ({
        id: r.id,
        vault_id: r.vault_id,
        action_type: r.action_type,
        action: r.action_type,
        amount_in_usd: r.amount_in_usd,
        amountUsd: r.amount_in_usd,
        created_at: r.created_at,
        createdAt: r.created_at,
        hash: r.hash,
        status: r.status,
      }));
  
      return ok({ page, limit, total, items });
    } catch (e) {
      return ok({ page: 1, limit: 25, total: 0, items: [] });
    }
  }),

  // ---- Analytics
  http.get("/data-management/external/vaults/:vaultId/histogram", async () => ok(mockVaultAnalytics)),

  // ---- Latest / execution withdrawals
  http.get("/data-management/external/withdrawals/latest", async () => ok({ status: "success" })),
  http.get("/data-management/external/withdrawals", async () => ok({ page: 1, total: 0, items: [] })),
  http.get("/data-management/external/withdrawal-requests/by-user", async () => ok([])),
  http.get("/data-management/external/withdrawal-requests/multi-tokens", async () =>
    ok([
      {
        receive_tokens: [
          { token_symbol: "USDC", token_name: "USDC", token_address: "USDC", decimal: 6 },
        ],
        withdraw_time_requests: [Date.now()],
        withdraw_amount_requests: ["1000000"],
        withdraw_amount_collateral_requests: ["1000000"],
        expire_time: Math.floor(Date.now() / 1000) + 3600,
        pks: ["abcdef"],
        signatures: ["abcdef"],
        sig_token: "USDC",
        is_ready: true,
        receive_amounts: ["1000000"],
      },
    ])
  ),

  // ---- User holdings (Estimated LP Breakdown)
  http.get("/data-management/external/user/vault-stats", async () => ok(mockUserHolding)),
  http.get("/data-management/external/vaults/:vaultId/user-holding", async () => ok(mockUserHolding)),

  // ---- Tokens / Prices / Deposit tokens
  http.post("/data-management/external/vaults/token-prices", async () =>
    ok([{ id: "USDC", price: 1 }, { id: "SUI", price: 1.2 }, { id: "DEEP", price: 0.15 }])
  ),
  http.post("/data-management/external/vaults/ndlp-prices", async () =>
    ok([{ vault_id: Object.keys(mockBasicDetails)[0], ndlp_price_usd: 1 }])
  ),
  http.get("/data-management/external/vaults/list-deposit-tokens", async () =>
    ok([
      { token_id: 1, token_symbol: "USDC", token_name: "USDC", token_address: "" + Object.values(mockBasicDetails)[0].collateral_token, decimal: 6, url: "", exchange_id: 1, min_deposit_amount: "0", min_deposit_amount_usd: "0" },
    ])
  ),
  // Support alternate deposit tokens endpoint
  http.get("/data-management/external/vaults/deposit-tokens", async () =>
    ok([
      { token_id: 1, token_symbol: "USDC", token_name: "USDC", token_address: "" + Object.values(mockBasicDetails)[0].collateral_token, decimal: 6, url: "", exchange_id: 1, min_deposit_amount: "0", min_deposit_amount_usd: "0" },
    ])
  ),

  // Check deposit: always allow in mock mode
  http.get("/data-management/external/vaults/:vaultId/check-deposit", async () => ok({ can_deposit: true })),

  // ---- Leaderboards
  http.get("/data-management/external/user/leaderboard/this-week-leaderboard", async ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("leaderboard_type") || "tvl";
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const list = Array.from({ length: 10 }).map((_, i) => ({
      tvl_usd: String(1000000 - i * 10000),
      ref_tvl_usd: String(500000 - i * 5000),
      reward_gems: String(100 - i),
      reward_xp_shares: String(50 - i),
      reward_usdc: String(1000 - i * 10),
      aggregation_sources: {},
      datetime_from: lastWeek.toISOString(),
      datetime_to: now.toISOString(),
      ranking: i + 1,
      user_wallet: `0xLEADER_${i + 1}`,
    }));
    return ok({
      list,
      isoDatetimeFrom: lastWeek.toISOString(),
      isoDatetimeTo: now.toISOString(),
      lastUpdate: now.toISOString(),
    });
  }),
  http.get("/data-management/external/user/leaderboard/last-week-leaderboard", async ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("leaderboard_type") || "tvl";
    const end = new Date();
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    const list = Array.from({ length: 10 }).map((_, i) => ({
      tvl_usd: String(900000 - i * 9000),
      ref_tvl_usd: String(450000 - i * 4500),
      reward_gems: String(80 - i),
      reward_xp_shares: String(40 - i),
      reward_usdc: String(800 - i * 8),
      aggregation_sources: {},
      datetime_from: start.toISOString(),
      datetime_to: end.toISOString(),
      ranking: i + 1,
      user_wallet: `0xLAST_${i + 1}`,
    }));
    return ok({
      list,
      isoDatetimeFrom: start.toISOString(),
      isoDatetimeTo: end.toISOString(),
      lastUpdate: end.toISOString(),
    });
  }),
  http.get("/data-management/external/user/leaderboard/info", async ({ request }) => {
    const url = new URL(request.url);
    const wallet = url.searchParams.get("user_wallet") || "0xMOCK_WALLET";
    const now = new Date();
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return ok({
      datetime_from: start.toISOString(),
      datetime_to: now.toISOString(),
      user_wallet: wallet,
      tvl_usd: "1000000",
      ref_tvl_usd: "500000",
      tvl_ranking: 2,
      referred_ranking: 5,
    });
  }),
  http.get("/data-management/external/user/leaderboard/config-rewards", async () => {
    const config = {
      rankings: {
        "1": { reward_gems: 100, reward_usdc: 1000, reward_xp_shares: 50 },
        "2": { reward_gems: 60, reward_usdc: 600, reward_xp_shares: 30 },
        "3": { reward_gems: 40, reward_usdc: 400, reward_xp_shares: 20 },
      },
      requirements: { min_tvl_usd: 100 },
      ranking_weight: { by_tvl_usd: 1, by_ref_tvl_usd: 1 },
    };
    return ok({
      tvl_config_rewards: config,
      referred_config_rewards: config,
    });
  }),
];
