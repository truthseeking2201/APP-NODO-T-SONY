import { ONE_MILLION, COIN_DECIMALS } from '@/config/mock';

export function toNumber(x: any): number {
  if (typeof x === 'number') return Number.isFinite(x) ? x : 0;
  if (typeof x === 'bigint') return Number(x);
  if (typeof x === 'string') return Number(x.replaceAll(',', '').trim());
  return 0;
}

export function uiFromUnits(units: any, symbol: string): number {
  const d = COIN_DECIMALS[symbol] ?? 6;
  const n = toNumber(units);
  return Number.isFinite(n) ? n / 10 ** d : 0;
}

export function safeAvailable(val: any, fallback = ONE_MILLION): number {
  const n = toNumber(val);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

