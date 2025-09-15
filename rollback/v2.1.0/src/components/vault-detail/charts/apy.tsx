import { useState, useEffect, Fragment, useMemo } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";

import { PERIOD_TABS } from "../constant";
import { formatDate } from "@/utils/date";
import { formatShortCurrency } from "@/utils/currency";

interface CustomTooltipProps {
  payload?: any[];
  label?: string;
  period: string;
}

interface APYChartProps {
  period: string;
  analyticsData: any;
}

/**
 * Custom tooltip component for different chart types
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  payload,
  label,
  period,
}) => {
  const data = payload[0]?.payload;
  if (!data) {
    return null;
  }
  return (
    <div className="bg-black p-3 border border-white/20 rounded-lg shadow-lg w-[250px]">
      <div className="text-xs font-bold text-white mb-[6px]">
        {period === PERIOD_TABS[1].value
          ? formatDate(label, "dd MMM yyyy HH:mm")
          : formatDate(label, "HH:mm")}
      </div>
      <div className="flex items-end justify-between mb-1">
        <span className="font-medium text-xs text-white/80">APY: </span>
        <span className="font-mono text-sm font-semibold text-white">
          {Number(data.apy).toFixed(2)}%
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-medium text-xs text-white/80">
          Cumulative Yields:
        </span>
        <span className="font-mono text-sm font-semibold text-white">
          {Number(data.cumulativeYields).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const APYChart = ({ period, analyticsData }: APYChartProps) => {
  const chartData = useMemo(() => {
    return analyticsData?.list?.map((item) => {
      const cumulativeYields = Number(item.value.lp_fee).toFixed(4) || 0;
      const apy = Number(item.value.apy).toFixed(4) || 0;

      return {
        timestamp: item.value.date,
        cumulativeYields: cumulativeYields,
        apy: apy,
      };
    });
  }, [analyticsData]);

  if (!chartData || chartData?.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center font-bold font-mono text-white">
        No data found
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={chartData}
        margin={{ top: 30, right: 0, left: 0, bottom: 7 }}
      >
        <defs>
          <linearGradient id="priceLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9DEBFF" />
            <stop offset="100%" stopColor="#00FF5E" />
          </linearGradient>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FF5E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00FF5E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12, fontFamily: "sans-serif", fill: "#fff" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            period === PERIOD_TABS[1].value
              ? formatDate(value, "dd/MM")
              : formatDate(value, "HH:mm")
          }
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12, fontFamily: "monospace", fill: "#fff" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
          label={{
            value: "APY",
            position: "top",
            dx: 15,
            offset: 20,
            className: "font-mono text-white/80 text-xs",
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fontFamily: "monospace", fill: "#fff" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${formatShortCurrency(value, 4)}`}
          label={{
            value: "USDC",
            position: "top",
            dx: -10,
            offset: 20,
            className: "font-mono text-white/80 text-xs",
          }}
        />
        <Tooltip content={<CustomTooltip period={period} />} />
        <Legend
          content={
            <div className="flex gap-[200px] px-4 py-2 justify-center">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    display: "inline-block",
                    width: 100,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #9DEBFF 0%, #00FF5E 100%)",
                    borderRadius: 1,
                  }}
                />
                <span className="text-sm text-white font-bold">
                  Cumulative Yields
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    display: "inline-block",
                    width: 38,
                    height: 12,
                    background: "rgba(253, 235, 207, 0.6)",
                    borderRadius: 2,
                  }}
                />
                <span className="text-sm text-white font-bold">APY</span>
              </div>
            </div>
          }
        />
        <Bar
          yAxisId="left"
          dataKey="apy"
          fill="rgba(253, 235, 207, 0.6)"
          opacity={0.7}
          radius={[2, 2, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumulativeYields"
          stroke="url(#priceLineGradient)"
          strokeWidth={2}
          dot={({ cx, cy, index }) => {
            if (index === chartData.length - 1) {
              return (
                <Fragment key={index}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={16}
                    fill="url(#dotGradient)"
                    style={{ filter: "blur(3px)" }}
                    className="animate-pulse"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#00FF5E"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                </Fragment>
              );
            }
          }}
          isAnimationActive={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default APYChart;
