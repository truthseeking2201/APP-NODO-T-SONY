import { LabelWithTooltip } from "@/components/ui/label-with-tooltip";

type Props = {
  leverage: number;
  ltv: number; // 0..1
  health_factor: number;
  debt_collateral: number; // in collateral units
  unit?: string; // e.g., USDC, SUI
};

export default function LoopingRiskMetrics({ leverage, ltv, health_factor, debt_collateral, unit = "" }: Props) {
  const hfColor = health_factor >= 2 ? "text-[#3FE6B0]" : health_factor >= 1.3 ? "text-[#FBBF24]" : "text-red-500";
  return (
    <section className="mt-4 rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
      <div className="text-sm font-medium mb-3">Looping Risk Metrics</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <LabelWithTooltip hasIcon={false} label="Exposure" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Total position size vs deposit due to leverage." />
          <div className="text-white font-mono text-base">x{leverage.toFixed(1)}</div>
        </div>
        <div>
          <LabelWithTooltip hasIcon={false} label="Current LTV" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Loan-to-Value tracked by AI; kept in safe range." />
          <div className="text-white font-mono text-base">{(ltv * 100).toFixed(0)}%</div>
        </div>
        <div>
          <LabelWithTooltip hasIcon={false} label="Health Factor" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Higher is safer; risk rises as HF approaches 1.0." />
          <div className={`font-mono text-base ${hfColor}`}>{health_factor.toFixed(1)}</div>
        </div>
        <div>
          <LabelWithTooltip hasIcon={false} label="Debt" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Outstanding borrowed amount in collateral units." />
          <div className="text-white font-mono text-base">{debt_collateral.toLocaleString()} {unit}</div>
        </div>
      </div>
    </section>
  );
}

