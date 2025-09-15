import { DetailWrapper } from "@/components/vault-detail/detail-wrapper";
import { LabelWithTooltip } from "@/components/ui/label-with-tooltip";
import { useVaultBasicDetails } from "@/hooks";

export default function LoopingMetricsSection({ vault_id }: { vault_id: string }) {
  const { data: vault } = useVaultBasicDetails(vault_id);
  const isLooping = Boolean((vault as any)?.metadata?.is_looping);
  const metrics = (vault as any)?.metadata?.looping_metrics || {};

  if (!isLooping) return null;

  const hf: number = Number(metrics?.health_factor ?? 0);
  const hfColor = hf >= 2 ? "text-[#3FE6B0]" : hf >= 1.3 ? "text-[#FBBF24]" : "text-red-500";

  return (
    <DetailWrapper title="Looping Metrics">
      <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 md:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <LabelWithTooltip hasIcon={false} label="Leverage" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Exposure multiplier vs deposit." />
            <div className="text-white font-mono text-base">x{Number(metrics?.leverage ?? 0).toFixed(1)}</div>
          </div>
          <div>
            <LabelWithTooltip hasIcon={false} label="LTV" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Loan-to-Value targeted by AI." />
            <div className="text-white font-mono text-base">{Math.round(Number(metrics?.ltv ?? 0) * 100)}%</div>
          </div>
          <div>
            <LabelWithTooltip hasIcon={false} label="Health Factor" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Higher is safer; watch if near 1.0." />
            <div className={`font-mono text-base ${hfColor}`}>{hf.toFixed(1)}</div>
          </div>
          <div>
            <LabelWithTooltip hasIcon={false} label="Debt" labelClassName="text-white/60 text-xs mb-1" tooltipContent="Outstanding borrowed amount." />
            <div className="text-white font-mono text-base">{Number(metrics?.debt_collateral ?? 0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </DetailWrapper>
  );
}

