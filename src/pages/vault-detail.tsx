import DetailsBackground from "@/assets/images/bg-details.webp";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import HeaderDetail from "@/components/vault-detail/sections/header-detail";
import HelpfulInfo from "@/components/vault-detail/sections/helpful-info";
import StrategyExplanation from "@/components/vault-detail/sections/strategy-explanation";
import VaultActivities from "@/components/vault-detail/sections/vault-activities";
import VaultAnalytics from "@/components/vault-detail/sections/vault-analytics";
import UserPositionSection from "@/components/vault-detail/sections/user-position-section";
import PnlBreakdownSection from "@/components/vault-detail/sections/pnl-breakdown";
import LoopingMetricsSection from "@/components/vault-detail/sections/looping-metrics";
import VaultInfo from "@/components/vault-detail/sections/vault-info";
// import YourHoldings from "@/components/vault-detail/sections/your-holdings";
import YourHoldingsCard from "@/features/vault-detail/cards/YourHoldingsCard";
import StickyAsideLayout from "@/shared/layouts/StickyAsideLayout";
import ManageLiquidityCard from "@/features/vaults/components/ManageLiquidityCard";
import { useVaultTab } from "@/features/vault-detail/useTab";
import { UnderlineTabs } from "@/components/ui/UnderlineTabs";
import { EXCHANGE_CODES_MAP } from "@/config/vault-config";
import { useGetDepositVaults, useVaultBasicDetails } from "@/hooks";
import { formatAmount } from "@/lib/utils";
import { BasicVaultDetailsType } from "@/types/vault-config.types";
import ApyTooltipContent from "@/components/apy/ApyTooltipContent";
import type { ApyBreakdown } from "@/types/apy.types";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useBreakpoint from "@/hooks/use-breakpoint";

export type VaultInfo = {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  tooltip?: any;
};

const VaultDetail = () => {
  const { vault_id } = useParams();
  const { data: vaultDetails, isLoading: isLoadingVaultDetails } =
    useVaultBasicDetails(vault_id);
  const { isMd } = useBreakpoint();
  const {
    data: depositVaults,
    isLoading: isLoadingDepositVaults,
    isFetching: isFetchingDepositVaults,
    refetch: refetchDepositVaults,
  } = useGetDepositVaults();

  const depositVault = depositVaults?.find(
    (vault) => vault.vault_id === vault_id
  );

  const vaultListLoaded = depositVaults?.length > 0 && !isLoadingDepositVaults;
  let isValidVault = vaultListLoaded && !!depositVault;
  if (!isValidVault && isFetchingDepositVaults) {
    isValidVault = true;
  }
  const isDetailLoading = isLoadingVaultDetails || !vaultDetails;

  const navigate = useNavigate();

  const handleBackToHome = () => {
    refetchDepositVaults();
    navigate("/", { replace: true });
  };

  const vaultInfo = useMemo(() => {
    return [
      {
        label: "APY",
        tooltip: (
          <ApyTooltipContent
            variant="detail"
            apy={
              ((vaultDetails as any)?.apyBreakdown ||
                (vaultDetails as any)?.metadata?.apyBreakdown ||
                (vaultDetails as any)?.metadata?.apy_breakdown) as ApyBreakdown
            }
          />
        ),
        value: !isLoadingVaultDetails
          ? formatAmount({
              amount: vaultDetails?.vault_apy,
            })
          : "--",
        suffix: "%",
      },
      {
        label: "TVL",
        tooltip: "Total Liquidity Value at the current market price",
        value: !isLoadingVaultDetails
          ? formatAmount({
              amount: vaultDetails?.total_value_usd,
            })
          : "--",
        prefix: "$",
      },
      {
        label: "24h Rewards",
        tooltip:
          "Total LP fees and token incentives earned by the vault in the last 24 hours. Updates every 1 hour.",
        value: !isLoadingVaultDetails
          ? formatAmount({
              amount: vaultDetails?.rewards_24h_usd,
            })
          : "--",
        prefix: "$",
      },
      {
        label: "NDLP Price",
        tooltip:
          "Price of 1 NDLP token based on the vault’s total value. (Unit USD)",
        value: !isLoadingVaultDetails
          ? formatAmount({
              amount: vaultDetails?.ndlp_price_usd,
              precision: 4,
            })
          : "--",
        prefix: "$",
      },
    ];
  }, [vaultDetails, isLoadingVaultDetails]);

  if ((!vaultDetails || !isValidVault) && !isLoadingVaultDetails) {
    return <Navigate to="/" replace />;
  }

  const tokens =
    (vaultDetails as BasicVaultDetailsType)?.pool?.pool_name?.split("-") || [];
  const exchange = EXCHANGE_CODES_MAP[
    (vaultDetails as BasicVaultDetailsType)?.exchange_id
  ] || {
    code: "",
    name: "",
    image: "",
  };

  const [tab, setTab] = useVaultTab();

  const Header = (
    <header
      className="relative bg-gradient-to-b from-[#0c0c0d] to-transparent pt-6 pb-6"
      style={{ ["--vault-header-h" as any]: "320px" }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
        <Button
          variant="outline"
          className="mb-4 border-white/30 text-sm"
          size={isMd ? "default" : "sm"}
          onClick={handleBackToHome}
        >
          <ChevronLeft className="!w-6 !h-6" />
          AI Vaults
        </Button>
        <HeaderDetail
          vault={vaultDetails}
          exchange={exchange}
          tokens={tokens}
          vaultInfo={vaultInfo}
          vaultDetails={vaultDetails}
          isDetailLoading={isDetailLoading}
        />
      </div>
    </header>
  );

  const LeftColumn = (
    <div className="space-y-6">
      <UnderlineTabs
        value={tab}
        onValueChange={(v) => setTab(v as any)}
        items={[
          { value: "overview", label: "Overview" },
          { value: "holdings", label: "Your Holdings" },
        ]}
        className="mt-2"
      />

      {tab === "overview" && (
        <div className="space-y-6">
          <VaultAnalytics
            vault_id={vault_id as string}
            isDetailLoading={isDetailLoading}
            vault={vaultDetails}
          />
          <UserPositionSection />
          <PnlBreakdownSection vault_id={vault_id as string} />
          <LoopingMetricsSection vault_id={vault_id as string} />
          <VaultActivities isDetailLoading={isDetailLoading} vault_id={vault_id} />
          <StrategyExplanation vault={vaultDetails} isDetailLoading={isDetailLoading} />
          <VaultInfo vaultDetails={vaultDetails} isDetailLoading={isDetailLoading} />
          <HelpfulInfo isDetailLoading={isDetailLoading} />
        </div>
      )}

      {tab === "holdings" && (
        <div className="space-y-6">
          <YourHoldingsCard />
        </div>
      )}
    </div>
  );

  const RightColumn = (
    <ManageLiquidityCard vault_id={vault_id as string} />
  );

  return (
    <PageContainer backgroundImage={DetailsBackground} className="vault-page max-md:py-0 py-0 pb-[160px]">
      <StickyAsideLayout header={Header} left={LeftColumn} right={RightColumn} topOffsetPx={36} />
    </PageContainer>
  );
};

export default VaultDetail;
