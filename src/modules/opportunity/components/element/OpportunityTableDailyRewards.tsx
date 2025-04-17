import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Group } from "packages/dappkit/src";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";
import DailyRewardsTooltip from "@core/components/element/dailyRewards/DailyRewardsTooltip";

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
    <EventBlocker>
      <Dropdown size="xl" onHover look="soft" content={<DailyRewardsTooltip opportunity={opportunity} />}>
        <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
      </Dropdown>
    </EventBlocker>
  );
}
