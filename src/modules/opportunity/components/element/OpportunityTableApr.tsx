import AprModal from "@core/components/element/apr/AprModal";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Text, Value } from "packages/dappkit/src";

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
  const aprFormat = useMerklConfig(store => store.config.decimalFormat.apr);

  return (
    <EventBlocker>
      <Dropdown size="xl" onHover content={<AprModal opportunity={opportunity} {...props} />}>
        <Text bold look="tint" size="lg">
          {children ?? (
            <Value value format={format ?? aprFormat}>
              {opportunity.apr / 100}
            </Value>
          )}
        </Text>
      </Dropdown>
    </EventBlocker>
  );
}
