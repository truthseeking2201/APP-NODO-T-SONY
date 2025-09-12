// src/mocks/fixtures/coins.ts
import { COIN_TYPES_CONFIG, USDC_CONFIG, LP_TOKEN_CONFIG } from "@/config/coin-config";

/**
 * Every coin balance must be 1,000,000 in UI terms.
 * We'll return smallest units = 1_000_000 * 10^decimals
 */
const toUnits = (n: number, decimals: number) =>
  (BigInt(Math.trunc(n)) * (10n ** BigInt(decimals))).toString();

export const ONE_MILLION = 1_000_000;

export function makeCoinBalances() {
  const base: { coinType: string; totalBalance: string; decimals?: number }[] = [];

  // Collateral tokens declared in config
  for (const t of COIN_TYPES_CONFIG.collateral_tokens) {
    // best-effort decimals guess: 6 for USDC, 9 otherwise
    const decimals = t.id === USDC_CONFIG.coinType ? USDC_CONFIG.decimals : 9;
    base.push({
      coinType: t.id,
      totalBalance: toUnits(ONE_MILLION, decimals),
      decimals,
    });
  }

  // Include NDLP (LP token) with 6 decimals by convention here (mock coin type)
  const ndlpCoinType = "0xMOCK::ndlp::NDLP";
  base.push({
    coinType: ndlpCoinType,
    totalBalance: toUnits(ONE_MILLION, LP_TOKEN_CONFIG.decimals ?? 6),
    decimals: LP_TOKEN_CONFIG.decimals ?? 6,
  });

  // And SUI GAS to avoid gas checks failing
  base.push({
    coinType: "0x2::sui::SUI",
    totalBalance: toUnits(ONE_MILLION, 9),
    decimals: 9,
  });

  return base;
}

