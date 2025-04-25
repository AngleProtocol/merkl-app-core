import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { type Component, Text, Value } from "dappkit";

export type OpportunityCellTvlProps = {
  opportunity: Opportunity;
};

export default function OpportunityCellTvl({ opportunity }: Component<OpportunityCellTvlProps>) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  return (
    <Text look="base">
      <Value value format={dollarFormat}>
        {opportunity.tvl ?? 0}
      </Value>{" "}
      TVL
    </Text>
  );
}
