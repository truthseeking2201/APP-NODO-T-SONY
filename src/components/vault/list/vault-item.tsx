import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { VaultItemData } from "./vault-list";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const VaultItem = ({ item }: { item: VaultItemData }) => {
  const { windowWidth } = useBreakpoint();
  const isLargeScreen = windowWidth >= 1440;

  return (
    <div className="flex items-center gap-4 min-w-[180px] max-w-[240px] 2xl:max-w-none">
      <div className="flex items-center justify-center">
        {item.token_pools?.length > 0 &&
          item.token_pools.map((token) => (
            <img
              key={token.name}
              src={token.image}
              alt={token.name}
              className={cn(
                "rounded-full flex-shrink-0",
                isLargeScreen ? "w-[32px] h-[32px]" : "w-[24px] h-[24px]"
              )}
            />
          ))}
      </div>
      <div>
        <div className="font-semibold text-white text-base leading-tight mb-1 flex items-center gap-2">
          {item.vault_name}
          {item?.is_looping && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#0D314A] text-[#6AD6FF] border border-white/15">
                    LP+
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 rounded-xl shadow-lg p-3 w-[260px] border border-white/15 text-xs">
                  Boosted liquidity with borrowing and reinvestment. AI manages LTV for safety.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex gap-1 items-center text-base">
          <img
            src={item.exchange_image}
            alt={item.exchange_name}
            className="h-[12px]"
          />
          <div className={cn("font-sans font-semibold text-xs")}>
            {item.exchange_name}
          </div>
        </div>
      </div>
    </div>
  );
};
