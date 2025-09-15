import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus, ArrowUpRight } from "lucide-react";
import SwapIcon from "@/assets/icons/swap.svg";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";
import TableMobile, {
  RowTokens,
  RowType,
  RowTime,
  RowValue,
  RowAction,
  RowSkeleton,
} from "@/components/ui/table-mobile";
import {
  ADD_LIQUIDITY_TYPES,
  REMOVE_LIQUIDITY_TYPES,
  ITEMS_PER_PAGE,
} from "@/components/vault-detail/constant";
import { renamingType } from "@/components/vault-detail/activities/utils";
import ConditionRenderer from "@/components/shared/condition-renderer";
import ExternalIcon from "@/assets/icons/external-gradient.svg?react";
import { useValueUnitStore, convertUsd } from "@/store/valueUnit";

const MobileList = ({
  paginatedTransactions,
  isFetched,
  handleSelectTransaction,
}: {
  paginatedTransactions: any[];
  isFetched: boolean;
  handleSelectTransaction: (transaction: any) => void;
}) => {
  const { unit: viewUnit, suiPriceUsd, ensureSuiPrice } = useValueUnitStore();
  if (viewUnit === 'SUI') ensureSuiPrice();
  return (
    <ConditionRenderer
      when={isFetched}
      fallback={
        <TableMobile>
          {Array(ITEMS_PER_PAGE)
            .fill(0)
            .map((_, i) => (
              <Fragment key={i}>
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <hr className="bg-white/80 my-4" />
              </Fragment>
            ))}
        </TableMobile>
      }
    >
      <TableMobile>
        {paginatedTransactions.map((tx, index) => (
          <Fragment key={`transaction-${index}`}>
            <RowType
              type={renamingType(tx.type)}
              icon={
                ADD_LIQUIDITY_TYPES.includes(tx.type) ? (
                  <Plus size={16} className="inline-block mr-1" />
                ) : REMOVE_LIQUIDITY_TYPES.includes(tx.type) ? (
                  <ArrowUpRight size={16} className="inline-block mr-1" />
                ) : tx.type === "SWAP" ? (
                  <img
                    src={SwapIcon}
                    alt="Swap"
                    className="inline-block mr-1"
                  />
                ) : null
              }
              className={cn(
                "inline-block text-xs font-medium px-2 py-1 rounded-md",
                REMOVE_LIQUIDITY_TYPES.includes(tx.type) &&
                  "bg-[#F97316]/30 text-[#F97316]",
                ADD_LIQUIDITY_TYPES.includes(tx.type) &&
                  "bg-[#22C55E]/20 text-[#22C55E]",
                tx.type === "SWAP" && "bg-[#3B82F6]/30 text-[#3B82F6]"
              )}
            />
            <RowTokens tokens={tx.tokens} />
            <RowValue
              label="Value"
              value={
                viewUnit === '$'
                  ? formatCurrency(tx.value, 0, 0, 2, "currency", "USD")
                  : `${convertUsd(Number(tx.value || 0), viewUnit, suiPriceUsd).toLocaleString(undefined, { maximumFractionDigits: 4 })} SUI`
              }
            />
            <RowTime timestamp={tx.time} />
            <RowAction label="Tx Hash">
              <Button
                variant="link"
                size="sm"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTransaction(tx);
                }}
              >
                <ExternalIcon />
              </Button>
            </RowAction>
            <hr className="bg-white/80 my-4" />
          </Fragment>
        ))}
      </TableMobile>
    </ConditionRenderer>
  );
};

export default MobileList;
