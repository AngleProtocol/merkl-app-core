import merklConfig from "@core/config";
import type { Opportunity } from "@merkl/api";
import { type Component, Text, Value } from "packages/dappkit/src";

export type OpportunityCellTvlProps = {
  opportunity: Opportunity;
};

export default function OpportunityCellTvl({ opportunity }: Component<OpportunityCellTvlProps>) {
  return (
    <Text look="base">
      <Value value format={merklConfig.decimalFormat.dollar}>
        {opportunity.tvl ?? 0}
      </Value>{" "}
      TVL
    </Text>
  );
}
