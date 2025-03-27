import TvlModal from "@core/components/element/tvl/TvlModal";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, Text, Value } from "packages/dappkit/src";

export type OpportunityTableTvlProps = {
  opportunity: Opportunity;
};

export default function OpportunityTableTvl({
  opportunity,
  children,
  size: _,
  ...props
}: Component<OpportunityTableTvlProps>) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  if (opportunity.tvlRecord?.breakdowns?.length <= 0)
    return (
      <Text bold look="tint" size="lg">
        {children ?? (
          <Value value format={dollarFormat}>
            {opportunity.tvl ?? 0}
          </Value>
        )}
      </Text>
    );

  return (
    <Text bold look="tint" size="lg">
      <Dropdown size="xl" onHover content={<TvlModal opportunity={opportunity} {...props} />}>
        {children ?? (
          <Value value format={dollarFormat}>
            {opportunity.tvl ?? 0}
          </Value>
        )}
      </Dropdown>
    </Text>
  );
}
