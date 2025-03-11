import merklConfig from "@core/config";
import type { Opportunity } from "@merkl/api";
import { type Component, Group, Icon, Icons, Text, Value } from "packages/dappkit/src";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";

export type OpportunityTableDailyRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityTableDailyRewards({
  opportunity,
  size: _,
}: Component<OpportunityTableDailyRewardsProps>) {
  const { rewardsBreakdown } = useOpportunityRewards(opportunity);

  return (
    <Group size="sm">
      <Text look="hype" bold size="lg">
        <Value value format={merklConfig.decimalFormat.dollar}>
          {opportunity.dailyRewards ?? 0}
        </Value>
      </Text>
      <Icons>
        {rewardsBreakdown.map(({ token: { icon } }) => (
          <Icon key={icon} src={icon} />
        ))}
      </Icons>
    </Group>
  );
}
