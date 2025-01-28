import { Dropdown, Group, PrimitiveTag } from "dappkit";
import type { ReactNode } from "react";

export type BooleanRuleProps = { value: { label: ReactNode; description: string } };

export default function BooleanRule({ value: { label, description }, ...props }: BooleanRuleProps) {
  return (
    <Dropdown size="lg" padding="xs" content={<Group className="flex-col">{description}</Group>}>
      <PrimitiveTag look="soft" {...props}>
        {label}
      </PrimitiveTag>
    </Dropdown>
  );
}
