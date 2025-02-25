import useChain from "@core/modules/chain/hooks/useChain";
import { Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";

export default function ChainTag({ chain: { id }, ...props }: { chain: { id: number } } & PrimitiveTagProps) {
  const { chain } = useChain({ id });

  if (!chain) return;
  return (
    <PrimitiveTag look="base" key={chain.name} {...props}>
      <Icon size={props?.size} src={chain?.icon} />
      {chain?.name}
    </PrimitiveTag>
  );
}
