export type ApyBreakdown = {
  baseApr24h?: number; // decimal, e.g., 0.015 = 1.5%
  baseApr7d?: number;  // decimal
  nodoApr?: number;     // decimal
  campaigns?: Array<{ label: string; apr: number }>; // decimals
  totalApr?: number;    // decimal
  totalApy?: number;    // decimal (daily compounding)
  tvlUsd?: number;
  lastUpdatedIso?: string; // ISO timestamp
  xpUsdRate?: number;
};

