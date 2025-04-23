import AprTooltip from "@core/components/element/apr/AprTooltip";
import AprValue from "@core/components/element/apr/AprValue";
import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Group, Text } from "dappkit";
import OpportunityAPRIcon from "./OpportunityAPRIcon";

export type OpportunityTableAprProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityTableApr({
  opportunity,
  format,
  children,
  size: _,
  ...props
}: Component<OpportunityTableAprProps>) {
  return (
    <Group className="flex-nowrap items-center" size="xs">
      <OpportunityAPRIcon opportunity={opportunity} size="lg" />
      <EventBlocker>
        <Dropdown size="xl" onHover content={<AprTooltip opportunity={opportunity} {...props} />}>
          <Text bold look="tint" size="lg">
            {children ?? <AprValue value>{opportunity.apr}</AprValue>}
          </Text>
        </Dropdown>
      </EventBlocker>
    </Group>
  );
}
