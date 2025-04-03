import AprValue from "@core/components/element/apr/AprValue";
import type { Opportunity } from "@merkl/api";
import { type Component, Text } from "packages/dappkit/src";

export type OpportunityCellAprProps = {
  opportunity: Opportunity;
};

export default function OpportunityCellApr({ opportunity, size: _ }: Component<OpportunityCellAprProps>) {
  return (
    <Text look="bold" className="items-center">
      <AprValue value>{opportunity.apr}</AprValue> APR
    </Text>
  );
}
