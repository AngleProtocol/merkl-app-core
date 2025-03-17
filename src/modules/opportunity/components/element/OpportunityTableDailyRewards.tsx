import type { Opportunity, Token as TokenType } from "@merkl/api";
import { type Component, Dropdown, EventBlocker, Group } from "packages/dappkit/src";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";
import Token from "@core/modules/token/components/element/Token";
import { useMemo } from "react";

export type OpportunityTableDailyRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityTableDailyRewards({
  opportunity,
  size: _,
}: Component<OpportunityTableDailyRewardsProps>) {
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);

  const displayTokenBreakdowns = useMemo(() => {
    if (!opportunity.rewardsRecord?.breakdowns) return null;

    const mergedBreakdowns = opportunity.rewardsRecord.breakdowns.reduce<
      Record<string, { token: TokenType; amount: bigint }>
    >((acc, tokenBreakdown) => {
      const { token, amount } = tokenBreakdown;
      const key = token.address;

      if (acc[key]) {
        acc[key].amount = acc[key].amount + BigInt(amount);
      } else {
        acc[key] = { token, amount: BigInt(amount) };
      }

      return acc;
    }, {});

    return Object.values(mergedBreakdowns).map(({ token, amount }) => (
      <Group key={token.id}>
        <Token token={token} amount={amount} />
      </Group>
    ));
  }, [opportunity]);

  return (
    <EventBlocker>
      <Dropdown
        className="flex-nowrap items-center"
        size="sm"
        onHover
        content={<Group className="flex-col p-sm">{displayTokenBreakdowns}</Group>}>
        <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
      </Dropdown>
    </EventBlocker>
  );
}
