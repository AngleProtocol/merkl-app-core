import type { Token } from "@merkl/api";
import { Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";

export default function TokenTag({ token, ...props }: { token: Token } & PrimitiveTagProps) {
  return (
    <PrimitiveTag look="base" key={[token.address, token.symbol, token.chainId].join(" ")} {...props}>
      <Icon size={props?.size} src={token.icon} />
      {token?.symbol}
    </PrimitiveTag>
  );
}
