import AprModal from "@core/components/element/apr/AprModal";
import AprValue from "@core/components/element/apr/AprValue";
import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Text } from "packages/dappkit/src";

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
    <EventBlocker>
      <Dropdown size="xl" onHover content={<AprModal opportunity={opportunity} {...props} />}>
        <Text bold look="tint" size="lg">
          {children ?? <AprValue value>{opportunity.apr}</AprValue>}
        </Text>
      </Dropdown>
    </EventBlocker>
  );
}
