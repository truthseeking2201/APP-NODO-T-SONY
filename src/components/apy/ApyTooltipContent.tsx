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
  const campaigns = (apy?.campaigns ?? []).map((c) => ({
    label: c.label?.includes("OKX") ? c.label.replace(/Boost/i, "Campaign APR") : c.label,
    apr: Number.isFinite(c.apr as any) ? c.apr : 0,
  }));
  const updated = timeAgo(apy?.lastUpdatedIso);

  const clampZero = (n?: number | null) => (n == null || Number.isNaN(n) ? 0 : n);
  const base = clampZero(apy?.baseApr7d);
  const nodo = clampZero(apy?.nodoApr);
  const totalApr = clampZero(apy?.totalApr);

  // Listing shows up to 2 campaigns; Detail also shows up to 2 in text rows
  const maxLines = 2;
  const shownCampaigns = campaigns.slice(0, maxLines);
  const hiddenCount = Math.max(0, campaigns.length - shownCampaigns.length);

  // Donut data (detail only)
  const donutSlices = [
    { label: "Base 7d", apr: base, color: "#34D399" }, // emerald-400
    { label: "NODO", apr: nodo, color: "#38BDF8" }, // sky-400
  ];
  if (variant === "detail") {
    if (campaigns.length <= 3) {
      campaigns.forEach((c, i) =>
        donutSlices.push({ label: c.label, apr: c.apr, color: ["#A78BFA", "#F472B6", "#F59E0B"][i % 3] })
      );
    } else {
      const sum = campaigns.reduce((a, b) => a + (b.apr || 0), 0);
      donutSlices.push({ label: `Campaigns (${campaigns.length})`, apr: sum, color: "#A78BFA" });
    }
  }

  const showDonut = variant === "detail" && totalApr > 0.0000001 && donutSlices.some((s) => s.apr > 0);

  return (
    <div className="space-y-2">
      <div className="text-white font-medium">Total APY (daily compounding)</div>

      {variant === "detail" && (
        <div className="text-white/60 text-xs">Total APR = Base 7d + NODO + Campaign(s)</div>
      )}

      {showDonut && <Donut totalApr={totalApr} slices={donutSlices} />}

      <ul className="text-sm text-white/90 space-y-1">
        <Row label="Base APR (7-day rolling)" value={formatPct(apy?.baseApr7d)} />
        <Row label="NODO Incentives APR" value={formatPct(apy?.nodoApr)} />

        {shownCampaigns.map((c, i) => (
          <Row key={i} label={c.label} value={formatPct(c.apr)} />
        ))}
        {hiddenCount > 0 && (
          <li className="text-white/60 text-xs">+ {hiddenCount} more campaign APRs</li>
        )}

        <li className="h-px bg-white/10 my-2" />
        <Row label="Total APR" value={formatPct(apy?.totalApr)} bold />
        <Row label="APY shown" value={formatPct(apy?.totalApy)} bold mutedLabel />
      </ul>

      <div className="text-[11px] text-white/50 pt-1">
        {variant === "detail" ? (
          <>Base 24h: {formatPct(apy?.baseApr24h)} · XP converted to USD-equivalent for APR · Updated {updated}</>
        ) : (
          <>Base 24h: {formatPct(apy?.baseApr24h)} · Values may vary with TVL · Updated {updated}</>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  mutedLabel,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mutedLabel?: boolean;
}) {
  return (
    <li className="flex justify-between gap-4">
      <span className={mutedLabel ? "text-white/80" : undefined}>{label}</span>
      <span className={`[font-variant-numeric:tabular-nums] text-right ${bold ? "font-semibold" : "font-medium"}`}>
        {value}
      </span>
    </li>
  );
}

function Donut({
  totalApr,
  slices,
}: {
  totalApr: number;
  slices: Array<{ label: string; apr: number; color: string }>;
}) {
  const size = 88;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const total = slices.reduce((a, b) => a + (b.apr || 0), 0) || 1;

  let offset = 0;
  const arcs = slices
    .filter((s) => s.apr > 0)
    .map((s, i) => {
      const len = (s.apr / total) * C;
      const arc = (
        <circle
          key={i}
          r={r}
          cx={cx}
          cy={cy}
          fill="transparent"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${len} ${C - len}`}
          strokeDashoffset={-offset}
          strokeLinecap="butt"
        />
      );
      offset += len;
      return arc;
    });

  const centerText = formatPct(totalApr);

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle r={r} cx={cx} cy={cy} fill="transparent" stroke="#1F2937" strokeOpacity={0.4} strokeWidth={stroke} />
        {arcs}
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white text-[11px] font-semibold">
          {centerText}
        </text>
      </svg>
      <div className="text-xs text-white/80 space-y-1">
        {slices
          .filter((s) => s.apr > 0)
          .slice(0, 5)
          .map((s, i) => {
            const share = totalApr > 0 ? (s.apr / totalApr) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="flex-1">{s.label}</span>
                <span className="[font-variant-numeric:tabular-nums] text-white/90">{share.toFixed(1)}%</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ApyTooltipContent;
