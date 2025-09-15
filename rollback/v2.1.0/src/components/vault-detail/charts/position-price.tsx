import { Button } from "@/components/ui/button";
import { BasicVaultDetailsType } from "@/types/vault-config.types";
import { convertTokenBase } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { ArrowLeftRight } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PERIOD_TABS } from "../constant";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isConvertedToken: boolean;
  period: string;
}

interface PositionPriceChartProps {
  period: string;
  analyticsData: any;
  vault: BasicVaultDetailsType;
}

/**
 * Custom Legend component to avoid DOM prop warnings
 */
const CustomLegend = () => {
  return (
    <div className="flex gap-[200px] px-4 py-2 justify-center">
      <div className="flex items-center gap-2">
        <span
          style={{
            display: "inline-block",
            width: 100,
            height: 3,
            background: "linear-gradient(90deg, #9DEBFF 0%, #00FF5E 100%)",
            borderRadius: 1,
          }}
        />
        <span className="text-sm text-white font-bold">Price</span>
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
        <span className="text-sm text-white font-bold">Range Price</span>
      </div>
    </div>
  );
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  period,
}) => {
  if (!active || !payload || !payload.length) return null;

  const priceData = payload[0]?.payload;

  if (!priceData) return null;

  const displayPriceNum = Number(priceData.displayPrice);
  const minRangeNum = Number(priceData.rangeMin);
  const maxRangeNum = Number(priceData.rangeMax);

  const price = displayPriceNum.toFixed(3);
  const range = `${minRangeNum.toFixed(3)} - ${maxRangeNum.toFixed(3)}`;

  return (
    <div className="bg-black p-3 border border-white/20 rounded-lg shadow-lg w-[250px]">
      <div className="text-xs font-bold text-white mb-[6px]">
        {period === PERIOD_TABS[1].value
          ? formatDate(label, "dd MMM yyyy HH:mm")
          : formatDate(label, "HH:mm")}
      </div>
      {price && (
        <div className="flex items-end justify-between mb-1">
          <span className="font-medium text-xs text-white/80">
            Position Price:{" "}
          </span>
          <span className="font-mono text-sm font-semibold text-white">
            {price}
          </span>
        </div>
      )}
      <div className="flex items-end justify-between">
        <span className="font-medium text-xs text-white/80">Range: </span>
        <span className="font-mono text-sm font-semibold text-white">
          {range}
        </span>
      </div>
    </div>
  );
};

const PositionPriceChart = ({
  period,
  analyticsData,
  vault,
}: PositionPriceChartProps) => {
  const [isConvertedToken, setIsConvertedToken] = useState(false);

  const chartData = useMemo(() => {
    let dataList = analyticsData?.list;

    if (!dataList || dataList?.length === 0) {
      return [];
    }

    if (period === PERIOD_TABS[1].value) {
      dataList = dataList.slice(-73);
    }

    return dataList.map((item: any) => {
      const lower = Number(item.value.lower);
      const upper = Number(item.value.upper);
      const real = Number(item.value.real);
      const rangeMin = isConvertedToken
        ? convertTokenBase(upper, true)
        : lower.toFixed(4);
      const rangeMax = isConvertedToken
        ? convertTokenBase(lower, true)
        : upper.toFixed(4);
      const displayPrice = isConvertedToken
        ? convertTokenBase(real, true)
        : real.toFixed(4);
      return {
        timestamp: item.value.date,
        displayPrice: displayPrice,
        rangeMax,
        rangeMin,
        range: [rangeMin, rangeMax],
      };
    });
  }, [analyticsData, period, isConvertedToken]);

  const currentData = useMemo(
    () => analyticsData?.list?.[analyticsData?.list?.length - 1],
    [analyticsData]
  );

  const currentPrice = useMemo(
    () =>
      isConvertedToken
        ? convertTokenBase(Number(currentData?.value?.real), true)
        : Number(currentData?.value?.real),
    [isConvertedToken, currentData]
  );
  const minPrice = useMemo(
    () =>
      isConvertedToken
        ? convertTokenBase(Number(currentData?.value?.lower), true)
        : Number(currentData?.value?.lower),
    [isConvertedToken, currentData]
  );
  const maxPrice = useMemo(
    () =>
      isConvertedToken
        ? convertTokenBase(Number(currentData?.value?.upper), true)
        : Number(currentData?.value?.upper),
    [isConvertedToken, currentData]
  );

  const pair = useMemo(() => vault?.pool?.pool_name?.split("-") || [], [vault]);

  const handleSwapConversion = () => {
    setIsConvertedToken(!isConvertedToken);
  };

  // Memoize the index of the last valid displayPrice
  const lastPriceIndex = useMemo(() => {
    for (let i = chartData.length - 1; i >= 0; i--) {
      return i;
    }
    return null;
  }, [chartData]);

  if (!chartData || chartData?.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center font-bold font-mono text-white">
        No data found
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-4 w-full">
          <div className="p-4 border border-[#2A2A2A] rounded-lg w-full bg-white/10">
            <div className="text-white/80 text-sm">MIN PRICE</div>
            <div className="font-mono font-semibold text-md text-white">
              {Number(minPrice).toFixed(4)}
              <span className="text-white/80 font-sans font-normal ml-2">
                {isConvertedToken
                  ? `${pair[0]}/${pair[1]}`
                  : `${pair[1]}/${pair[0]}`}
              </span>
            </div>
          </div>
          <div className="p-4 border border-[#2A2A2A] rounded-lg w-full bg-white/10">
            <div className="text-white/80 text-sm">CURRENT PRICE</div>
            <div className="font-mono font-semibold text-white">
              {Number(currentPrice).toFixed(4)}
              <span className="text-white/80 font-sans font-normal ml-2">
                {isConvertedToken
                  ? `${pair[0]}/${pair[1]}`
                  : `${pair[1]}/${pair[0]}`}
              </span>
            </div>
          </div>
          <div className="p-4 border border-[#2A2A2A] rounded-lg relative w-full bg-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapConversion}
              className="absolute top-2 right-2 rounded-md h-7 w-7 bg-white/15"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <div className="text-white/80 text-sm">MAX PRICE</div>
            <div className="font-mono font-semibold text-white">
              {Number(maxPrice).toFixed(4)}
              <span className="text-white/80 font-sans font-normal ml-2">
                {isConvertedToken
                  ? `${pair[0]}/${pair[1]}`
                  : `${pair[1]}/${pair[0]}`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} barCategoryGap={6}>
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
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 10}
                fontSize={12}
                className="font-mono text-white/75"
                fill="#fff"
                textAnchor="middle"
              >
                {period === PERIOD_TABS[1].value
                  ? formatDate(payload.value, "dd/MM HH:mm")
                  : formatDate(payload.value, "HH:mm")}
              </text>
            )}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["dataMin - 0.1", "dataMax + 0.1"]}
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                fontSize={12}
                className="font-mono text-white"
                fill="#fff"
                textAnchor="end"
              >
                {` ${payload.value.toFixed(2)}`}
              </text>
            )}
          />

          <Legend content={<CustomLegend />} />
          <Tooltip
            content={
              <CustomTooltip
                isConvertedToken={isConvertedToken}
                period={period}
              />
            }
          />
          <Bar
            dataKey="rangeMax"
            fill="rgba(253, 235, 207, 0.6)"
            opacity={0.7}
            radius={[2, 2, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="displayPrice"
            stroke="url(#priceLineGradient)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
          {/* Custom last dot with gradient and blur */}
          <Line
            type="monotone"
            dataKey="displayPrice"
            stroke="none"
            dot={({ cx, cy, index }) =>
              index === lastPriceIndex ? (
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
              ) : null
            }
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PositionPriceChart;
