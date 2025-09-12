import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Form from "@/components/vault-detail/form";

type Props = {
  vault_id: string;
  className?: string;
};

export default function ManageLiquidityCard({ vault_id, className }: Props) {
  return (
    <Card className={"rounded-2xl border-0 bg-[#1A1B1F] shadow-lg "+(className||"")}>
      <CardHeader className="p-4 pb-2">
        <div className="text-white/90 text-base font-semibold">Manage Liquidity</div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <Form vault_id={vault_id} />
      </CardContent>
    </Card>
  );
}
