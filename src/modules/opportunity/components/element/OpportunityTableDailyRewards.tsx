import DailyRewardsTooltip from "@core/components/element/dailyRewards/DailyRewardsTooltip";
import type { Opportunity } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Group } from "dappkit";
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

  return opportunity.rewardsRecord.breakdowns.length ? (
    <EventBlocker>
      <Dropdown size="xl" onHover content={<DailyRewardsTooltip opportunity={opportunity} />}>
        <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
      </Dropdown>
    </EventBlocker>
  ) : (
    <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
  );
}
