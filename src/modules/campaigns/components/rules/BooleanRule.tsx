import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import { Dropdown, Group, PrimitiveTag } from "dappkit";
import type { ReactNode } from "react";

export type BooleanRuleProps = { value: { label: ReactNode; description: string } };

export default function BooleanRule({ value: { label, description }, ...props }: BooleanRuleProps) {
  const { track } = useMixpanelTracking();

  return (
    <Dropdown
      size="lg"
      padding="xs"
      onOpen={() => track("Click on button", { button: "range", type: "rule" })}
      content={<Group className="flex-col">{description}</Group>}>
      <PrimitiveTag look="soft" {...props}>
        {label}
      </PrimitiveTag>
    </Dropdown>
  );
}
