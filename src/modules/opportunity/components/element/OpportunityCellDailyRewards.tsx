import type { Opportunity } from "@merkl/api";
import { type Component, Group, Text } from "dappkit";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";

export type OpportunityCellDailyRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityCellDailyRewards({
  opportunity,
  size: _,
}: Component<OpportunityCellDailyRewardsProps>) {
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);

  return (
    <Group className="flex-nowrap items-center" size="sm">
      <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
      <Text bold look="hype">
        Daily Rewards
      </Text>
    </Group>
  );
}
