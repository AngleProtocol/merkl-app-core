import type { Opportunity } from "@merkl/api";
import { type Component, Text, Value } from "packages/dappkit/src";

export type OpportunityCellAprProps = {
  opportunity: Opportunity;
};

export default function OpportunityCellApr({ opportunity, size: _ }: Component<OpportunityCellAprProps>) {
  return (
    <Text look="bold" className="items-center">
      <Value value format="0a%">
        {opportunity.apr / 100}
      </Value>{" "}
      APR
    </Text>
  );
}
