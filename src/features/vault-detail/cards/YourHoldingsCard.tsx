import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TokenIcon } from "@/components/ui/TokenIcon";
import { ONE_MILLION } from "@/config/mock";
import LoopingRiskMetrics from "@/features/vault-detail/cards/LoopingRiskMetrics";
import { DetailWrapper } from "@/components/vault-detail/detail-wrapper";

type Holding = { token: string; amount: number; amount_in_usd: number; percent?: number };

const COLORS = ["#6EE7F9", "#C4B5FD", "#34D399", "#FBBF24", "#F87171"];

const fmtUSD = (n: number) =>
  (n ?? 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const fmtToken = (n: number, symbol: string) =>
  `${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`;

const fmtNum = (n: number) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function YourHoldingsCard() {
  const { vault_id } = useParams();
  const [ndlpPrice, setNdlpPrice] = useState<number>(1.12);
  const [holdings, setHoldings] = useState<Holding[]>([
    { token: "USDC", amount: 600_000, amount_in_usd: 600_000 },
    { token: "SUI", amount: 300_000, amount_in_usd: 300_000 },
    { token: "DEEP", amount: 100_000, amount_in_usd: 100_000 },
  ]);

  useEffect(() => {
    const id = vault_id || "nodo-nova-usdc";
    fetch(`/data-management/external/vaults/${id}/user-holding`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        const items = json?.data?.user_vault_tokens || json?.user_vault_tokens;
        if (Array.isArray(items) && items.length) {
          setHoldings(
            items.map((x: any) => ({
              token: String(x.token_symbol || x.token || "USDC"),
              amount: Number(x.amount ?? ONE_MILLION),
              amount_in_usd: Number(x.amount_in_usd ?? ONE_MILLION),
            }))
          );
        }
      })
      .catch(() => void 0);
  }, [vault_id]);

  // Looping metrics hydration
  const [looping, setLooping] = useState<{ is_looping?: boolean; metrics?: any }>({});
  useEffect(() => {
    const id = vault_id || "nodo-nova-usdc";
    fetch(`/data-management/external/vaults/${id}/user-holding`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        const root = json?.data || json || {};
        setLooping({ is_looping: Boolean(root.is_looping), metrics: root.looping_metrics });
      })
      .catch(() => void 0);
  }, [vault_id]);

  const totalUsd = holdings.reduce((a, b) => a + (b.amount_in_usd || 0), 0);
  const totalNdlp = ndlpPrice > 0 ? totalUsd / ndlpPrice : 0;

  // Mock P&L and share (replace with real data wiring when available)
  const pnlRewards = 248;
  const pnlIL = -173;
  const pnlNet = pnlRewards + pnlIL;
  const yourSharePct = 2.5;
  const yourShareNdlp = 4_652;
  const vaultNdlpSupply = 1_000_000;

  const withPct = useMemo(() => {
    const sum = totalUsd || 1;
    return holdings.map((h) => ({ ...h, percent: Math.round(((h.amount_in_usd || 0) / sum) * 1000) / 10 }));
  }, [holdings, totalUsd]);

  // Fetch current NDLP price if available (mock supported)
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/data-management/external/vaults/ndlp-prices`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vault_ids: [vault_id || "nodo-nova-usdc"] }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((arr) => {
        const price = Array.isArray(arr) ? Number(arr[0]?.ndlp_price_usd) : Number(arr?.ndlp_price_usd);
        if (isFinite(price) && price > 0) setNdlpPrice(price);
      })
      .catch(() => void 0);
    return () => controller.abort();
  }, [vault_id]);

  return (
    <div className="card-no-scroll">
      <DetailWrapper title="Your Holdings">
      {/* Header band */}
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Liquidity</div>
          <div className="mt-1 text-4xl md:text-5xl font-semibold [font-variant-numeric:tabular-nums]">
            {fmtUSD(totalUsd)}
          </div>
          <div className="mt-1 text-2xl md:text-3xl font-semibold text-muted-foreground [font-variant-numeric:tabular-nums]">
            {fmtToken(totalNdlp, "NDLP")}
          </div>
          <div className="mt-1 text-sm">
            <span className={pnlNet >= 0 ? "text-[#3FE6B0]" : "text-destructive"}>
              {pnlNet >= 0 ? "+" : "-"}
              {fmtUSD(Math.abs(pnlNet))}
            </span>
            <span className={pnlNet >= 0 ? "text-[#3FE6B0]" : "text-destructive"}>
              {" "}({pnlNet >= 0 ? "+" : "-"}0%)
            </span>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KPI title="24h Rewards" value={fmtUSD(12.5)} sub="Updates every 1h" />
        <KPI title="Break-even" value="$1.00" sub={`Current NDLP price: $${ndlpPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <KPI title="Your Share" value={`${yourSharePct}%`} sub={`≈ ${fmtNum(yourShareNdlp)} / ${fmtNum(vaultNdlpSupply)} NDLP`} />
      </div>

      {looping.is_looping && looping.metrics && (
        <LoopingRiskMetrics
          leverage={Number(looping.metrics.leverage ?? 0)}
          ltv={Number(looping.metrics.ltv ?? 0)}
          health_factor={Number(looping.metrics.health_factor ?? 0)}
          debt_collateral={Number(looping.metrics.debt_collateral ?? 0)}
          unit={"USDC"}
        />
      )}

      {/* Estimated LP Breakdown */}
      <section className="mt-6 rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Estimated LP Breakdown</div>
            <div className="text-xs text-muted-foreground">Secure updates ~1h • Updated 09:23:08</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: stacked rows */}
          <div className="lg:col-span-8 space-y-3">
            {withPct.map((h, idx) => (
              <div key={h.token} className="rounded-lg bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={h.token} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {h.token} {fmtNum(h.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">{h.percent}%</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{fmtUSD(h.amount_in_usd)}</div>
                  </div>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${h.percent}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: donut */}
          <div className="lg:col-span-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={withPct} dataKey="amount_in_usd" nameKey="token" innerRadius={56} outerRadius={80} stroke="none">
                  {withPct.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* All-Time P&L Breakdown */}
      <section className="mt-6 rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
        <div className="text-sm font-medium mb-3">All Time P&amp;L Breakdown</div>
        <Row label="Compounded Rewards" value={`+${fmtUSD(pnlRewards)}`} tone="pos" />
        <Row label="Impermanent Loss" value={`-${fmtUSD(Math.abs(pnlIL))}`} tone="neg" />
        <div className="h-px bg-border/80 my-2" />
        <Row label="Net P&L" value={`${pnlNet >= 0 ? "+" : "-"}${fmtUSD(Math.abs(pnlNet))}`} tone={pnlNet >= 0 ? "pos-bold" : "neg-bold"} />
      </section>

      {/* Cashflow */}
      <section className="mt-6 rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
        <div className="text-sm font-medium mb-3">Cashflow</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Tile label="Total Deposits" value={fmtUSD(1_000_000)} />
          <Tile label="Total Withdrawals" value={fmtUSD(0)} />
        </div>
      </section>
      </DetailWrapper>
    </div>
  );
}

function KPI({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold mt-1 [font-variant-numeric:tabular-nums]">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" | "pos-bold" | "neg-bold" }) {
  const base = "text-sm";
  const cls =
    tone === "pos" ? "text-[#3FE6B0]" :
    tone === "neg" ? "text-destructive" :
    tone === "pos-bold" ? "text-[#3FE6B0] font-semibold" :
    tone === "neg-bold" ? "text-destructive font-semibold" : "";
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className={base}>{label}</div>
      <div className={`${base} ${cls} [font-variant-numeric:tabular-nums]`}>{value}</div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold mt-1 [font-variant-numeric:tabular-nums]">{value}</div>
    </div>
  );
}
