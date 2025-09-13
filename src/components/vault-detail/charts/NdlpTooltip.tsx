import React from "react";

type Props = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "-";
  const val = Math.abs(n).toFixed(Math.abs(n) < 1 ? 2 : 1);
  return `${sign}${val}%`;
}

export default function NdlpTooltip({ active, payload, label }: Props) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const pct = Number(data.percentage ?? data.value ?? 0);

  const isPos = pct >= 0;
  const tone = isPos ? "text-[#3FE6B0]" : "text-red-500";

  return (
    <div className="bg-black/90 border border-white/20 rounded-xl shadow-xl p-3 w-[240px] pointer-events-none">
      <div className="text-xs font-semibold text-white/90 mb-2">
        {String(label)}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/70">NDLP Change</div>
        <div className={`text-sm font-mono font-semibold ${tone}`}>
          {formatPct(pct)}
        </div>
      </div>
    </div>
  );
}

