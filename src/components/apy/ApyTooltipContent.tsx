import React from "react";
import type { ApyBreakdown } from "@/types/apy.types";

type Props = { apy?: ApyBreakdown | null; variant: "listing" | "detail" };

function formatPct(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const v = Number(n) * 100;
  if (v !== 0 && Math.abs(v) < 0.01) return "<0.01%";
  return `${v.toFixed(2)}%`;
}

function timeAgo(iso?: string) {
  if (!iso) return "unknown";
  const t = new Date(iso).getTime();
  if (!isFinite(t)) return "unknown";
  const diff = Math.max(0, Date.now() - t);
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return `just now`;
}

export function ApyTooltipContent({ apy, variant }: Props) {
  const campaigns = apy?.campaigns ?? [];
  const shownCampaigns = campaigns.slice(0, 3);
  const more = Math.max(0, campaigns.length - shownCampaigns.length);
  const updated = timeAgo(apy?.lastUpdatedIso);

  return (
    <div className="space-y-2">
      <div className="text-white font-medium">Total APY (daily compounding)</div>

      {variant === "detail" && (
        <div className="text-white/60 text-xs">
          Total APR = Base 7d + NODO + Campaign(s)
        </div>
      )}

      <ul className="text-sm text-white/90 space-y-1">
        <li className="flex justify-between">
          <span>Base APR (7-day rolling)</span>
          <span className="font-medium">{formatPct(apy?.baseApr7d)}</span>
        </li>
        <li className="flex justify-between">
          <span>NODO Incentives APR</span>
          <span className="font-medium">{formatPct(apy?.nodoApr)}</span>
        </li>

        {shownCampaigns.map((c, i) => (
          <li key={i} className="flex justify-between">
            <span>{c.label}</span>
            <span className="font-medium">{formatPct(c.apr)}</span>
          </li>
        ))}

        {more > 0 && (
          <li className="text-white/60 text-xs">+ {more} more campaign APRs</li>
        )}

        <li className="h-px bg-white/10 my-2" />

        <li className="flex justify-between">
          <span className="font-semibold">Total APR</span>
          <span className="font-semibold">{formatPct(apy?.totalApr)}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-white/80">APY shown</span>
          <span className="font-semibold">{formatPct(apy?.totalApy)}</span>
        </li>
      </ul>

      <div className="text-[11px] text-white/50 pt-1">
        {variant === "detail" ? (
          <>
            Base 24h: {formatPct(apy?.baseApr24h)} · XP converted to USD-equivalent for APR · Updated {updated}
          </>
        ) : (
          <>
            Base 24h: {formatPct(apy?.baseApr24h)} · Values may vary with TVL · Updated {updated}
          </>
        )}
      </div>
    </div>
  );
}

export default ApyTooltipContent;

