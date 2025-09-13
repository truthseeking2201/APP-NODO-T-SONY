import { useState } from "react";
import { DetailWrapper } from "@/components/vault-detail/detail-wrapper";
import UserPosition from "@/components/vault-detail/charts/user-position";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = { defaultPeriod?: "D" | "W" };

const TABS = [
  { value: "D", label: "24h" },
  { value: "W", label: "7d" },
];

export default function UserPositionSection({ defaultPeriod = "D" }: Props) {
  const [period, setPeriod] = useState<"D" | "W">(defaultPeriod);

  return (
    <DetailWrapper
      title="NDLP Price (Profit Zone)"
      titleComponent={
        <Tabs value={period} onValueChange={(v) => setPeriod(v as "D" | "W") }>
          <TabsList className="p-1 flex gap-1">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
      loadingStyle="min-h-[340px] w-full"
    >
      <div className="min-h-[340px]">
        <UserPosition period={period} />
      </div>
    </DetailWrapper>
  );
}
