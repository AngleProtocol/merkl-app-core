import AprModal from "@core/components/element/apr/AprModal";
import merklConfig from "@core/config";
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
  return (
    <EventBlocker>
      <Dropdown size="xl" onHover content={<AprModal opportunity={opportunity} {...props} />}>
        <Text bold look="tint" size="lg">
          {children ?? (
            <Value value format={format ?? merklConfig.decimalFormat.apr}>
              {opportunity.apr / 100}
            </Value>
          )}
        </Text>
      </Dropdown>
    </EventBlocker>
  );
}
