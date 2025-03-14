import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { type Component, Text, Value } from "packages/dappkit/src";

export type OpportunityTableTvlProps = {
  opportunity: Opportunity;
};

export default function OpportunityTableTvl({ opportunity, children, size: _ }: Component<OpportunityTableTvlProps>) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  return (
    <Text bold look="tint" size="lg">
      {children ?? (
        <Value value format={dollarFormat}>
          {opportunity.tvl ?? 0}
        </Value>
      )}
    </Text>
  );
}
