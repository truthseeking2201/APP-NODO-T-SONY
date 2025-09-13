import Form from "@/components/vault-detail/form";
import { DetailWrapper } from "@/components/vault-detail/detail-wrapper";

type Props = {
  vault_id: string;
  className?: string;
};

export default function ManageLiquidityCard({ vault_id, className }: Props) {
  return (
    <div className={className}>
      <DetailWrapper title="Manage Liquidity" className="!p-4">
        <Form vault_id={vault_id} />
      </DetailWrapper>
    </div>
  );
}
