// src/config/mock.ts
/**
 * Mock mode is ON by default in dev or when the env is absent.
 * Set VITE_USE_MOCKS="false" to turn off.
 */
export const IS_MOCK =
  typeof import.meta.env?.VITE_USE_MOCKS === "string"
    ? import.meta.env.VITE_USE_MOCKS !== "false"
    : true;

export const MOCK_ADDRESS = "0xMOCK_WALLET";
export const ONE_MILLION = 1_000_000;

export const COIN_DECIMALS: Record<string, number> = {
  USDC: 6,
  SUI: 9,
  NDLP: 6,
};

export const asUnits = (n: number, decimals: number) =>
  (BigInt(n) * (10n ** BigInt(decimals))).toString();
