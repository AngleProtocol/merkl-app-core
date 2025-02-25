import useChain from "@core/modules/chain/hooks/useChain";
import type { Token } from "@merkl/api";
import { Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";

export default function TokenChainTag({ token, ...props }: { token: Token } & PrimitiveTagProps) {
  const { chain } = useChain({ id: token.chainId });

  if (!chain || !token) return;
  return (
    <PrimitiveTag look="base" key={[chain.name, token.symbol].join("-")} {...props}>
      <Icon size={props?.size} src={chain.icon} />
      {chain.name}
    </PrimitiveTag>
  );
}
