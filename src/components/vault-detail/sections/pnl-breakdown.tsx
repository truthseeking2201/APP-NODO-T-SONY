import { useEffect, useState } from "react";
import { useValueUnitStore, convertUsd } from "@/store/valueUnit";
import { DetailWrapper } from "@/components/vault-detail/detail-wrapper";
import { LabelWithTooltip } from "@/components/ui/label-with-tooltip";

type PnlData = {
  fees: number;
  il: number;
  rebalancing_cost: number;
  borrow_cost?: number;
  net: number;
  unit?: string;
};

export default function PnlBreakdownSection({ vault_id }: { vault_id: string }) {
  const [data, setData] = useState<PnlData | null>(null);
  const unit = data?.unit || "USDC";
  const { unit: viewUnit, suiPriceUsd, ensureSuiPrice } = useValueUnitStore();
  useEffect(() => {
    if (viewUnit === 'SUI') ensureSuiPrice();
  }, [viewUnit, ensureSuiPrice]);

  useEffect(() => {
    if (!vault_id) return;
    fetch(`/data-management/external/vaults/${vault_id}/pnl-breakdown`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => setData(json?.data || json))
      .catch(() => setData(null));
  }, [vault_id]);

  const Row = ({ label, value, tone }: { label: string; value: number; tone?: "pos" | "neg" | "neutral" }) => {
    const sign = value >= 0 ? "+" : "-";
    const color = tone
      ? tone === "pos"
        ? "text-[#3FE6B0]"
        : tone === "neg"
        ? "text-red-500"
        : "text-white"
      : value >= 0
      ? "text-[#3FE6B0]"
      : "text-red-500";
    const display = convertUsd(Math.abs(value), viewUnit, suiPriceUsd);
    return (
      <div className="flex items-center justify-between py-1.5">
        <div className="text-sm text-white/90">{label}</div>
        <div className={`text-sm font-mono ${color}`}>
          {sign}
          {display.toLocaleString(undefined, { maximumFractionDigits: 4 })} {viewUnit === '$' ? '$' : 'SUI'}
        </div>
      </div>
    );
  };

  return (
    <DetailWrapper title="P&L Breakdown">
      <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
        <Row label="Estimated Fees" value={data?.fees ?? 0} tone="pos" />
        <Row label="Impermanent Loss (vs holding)" value={data?.il ?? 0} tone="neg" />
        {/** Removed Rebalancing Cost & Borrow Cost rows */}
        <div className="h-px bg-white/15 my-3" />
        <div className="flex items-center justify-between">
          <LabelWithTooltip
            hasIcon={false}
            label="Net P&L"
            labelClassName="text-sm text-white/90"
            tooltipContent="P&L components expressed in collateral units."
          />
          <div className={`text-sm font-mono ${((data?.net ?? 0) >= 0 ? "text-[#3FE6B0]" : "text-red-500")}`}>
            {((data?.net ?? 0) >= 0 ? "+" : "-")}
            {convertUsd(Math.abs(data?.net ?? 0), viewUnit, suiPriceUsd).toLocaleString(undefined, { maximumFractionDigits: 4 })} {viewUnit === '$' ? '$' : 'SUI'}
          </div>
        </div>
      </div>
    </DetailWrapper>
  );
}
