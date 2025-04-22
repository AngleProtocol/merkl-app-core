import AprValue from "@core/components/element/apr/AprValue";
import type { Opportunity } from "@merkl/api";
import { type Component, Group, Text } from "packages/dappkit/src";
import OpportunityAPRIcon from "./OpportunityAPRIcon";

export type OpportunityCellAprProps = {
  opportunity: Opportunity;
};

export default function OpportunityCellApr({ opportunity, size: _ }: Component<OpportunityCellAprProps>) {
  return (
    <Group className="flex-nowrap items-center" size="xs">
      <OpportunityAPRIcon opportunity={opportunity} size="lg" />
      <Text look="bold" className="items-center">
        <AprValue value>{opportunity.apr}</AprValue> APR
      </Text>{" "}
    </Group>
  );
}
