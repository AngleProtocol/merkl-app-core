import { Dropdown, Group, PrimitiveTag, Value } from "dappkit";
import type { ReactNode } from "react";

export type LiquidityRuleProps = { value: { label: ReactNode; percentage: number; description: string } };

export default function LiquidityRule({ value, ...props }: LiquidityRuleProps) {
  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={<Group className="flex-col text-wrap max-w-[42ch]">{value.description}</Group>}>
      <PrimitiveTag look="soft" {...props}>
        {value.label}
        <Value format="0.#%" {...props}>
          {value.percentage / 10000}
        </Value>
      </PrimitiveTag>
    </Dropdown>
  );
}
