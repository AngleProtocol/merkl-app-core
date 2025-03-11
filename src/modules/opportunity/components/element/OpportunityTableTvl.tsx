import merklConfig from "@core/config";
import type { Opportunity } from "@merkl/api";
import { type Component, Text, Value } from "packages/dappkit/src";

export type OpportunityTableTvlProps = {
  opportunity: Opportunity;
};

export default function OpportunityTableTvl({ opportunity, children, size: _ }: Component<OpportunityTableTvlProps>) {
  return (
    <Text bold look="tint" size="lg">
      {children ?? (
        <Value value format={merklConfig.decimalFormat.dollar}>
          {opportunity.tvl ?? 0}
        </Value>
      )}
    </Text>
  );
}
