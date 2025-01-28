import Token from "@core/modules/token/components/element/Token";
import type { Token as TokenType } from "@merkl/api";
import { Divider, Group } from "dappkit";
import type { ReactNode } from "react";

export type TokenAmountModalProps = { tokens: { token: TokenType; amount: bigint }[]; label: ReactNode };

export default function TokenAmountModal({ label, tokens }: TokenAmountModalProps) {
  return (
    <Group className="flex-col">
      <Group className="flex-col gap-l">
        <Group className="justify-between">{label}</Group>
        <Divider look="soft" horizontal />
      </Group>
      {tokens.map(({ token, amount }) => (
        <Token format="amount_price" key={token.address} {...{ token, amount }} />
      ))}
    </Group>
  );
}
