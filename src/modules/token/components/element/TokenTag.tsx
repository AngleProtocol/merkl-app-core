import type { Token } from "@merkl/api";
import { Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import type { ReactNode } from "react";

export default function TokenTag({
  token,
  suffix,
  ...props
}: { token: Token; suffix?: ReactNode } & PrimitiveTagProps) {
  return (
    <PrimitiveTag look="base" key={[token.address, token.symbol, token.chainId].join(" ")} {...props}>
      <Icon size={props?.size} src={token.icon} />
      {token?.symbol}
      {suffix}
    </PrimitiveTag>
  );
}
