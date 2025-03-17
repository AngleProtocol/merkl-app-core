import type { Opportunity } from "@merkl/api";
import { type Component, Group } from "packages/dappkit/src";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";

export type OpportunityTableDailyRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityTableDailyRewards({
  opportunity,
  size: _,
}: Component<OpportunityTableDailyRewardsProps>) {
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);

  return (
    <Group className="flex-nowrap items-center" size="sm">
      <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
    </Group>
  );
}
