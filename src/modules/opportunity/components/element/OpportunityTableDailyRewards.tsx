import Token from "@core/modules/token/components/element/Token";
import type { Opportunity, Token as TokenType } from "@merkl/api";
import { type Component, Divider, Dropdown, EventBlocker, Group, Icon, Text, Value } from "packages/dappkit/src";
import { useMemo } from "react";
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

    return Object.values(mergedBreakdowns).map(({ token, amount }, index) =>
      token.isPreTGE ? (
        <Group key={token.id} className="flex-col">
          <Token token={token} amount={amount} />
          <Divider look="soft" horizontal />
          {!!token.price && (
            <Group className="justify-between">
              <Text>Pre TGE Unit Price:</Text>
              <Value format={"$0.######"}>{token.price}</Value>
            </Group>
          )}
          <Group className="justify-between flex">
            <Icon remix="RiTimer2Fill" size="md" />
            <Text size="sm">
              This token hasn’t launched yet.
              <br />
              Its unit price is estimated and subject to change.
            </Text>
          </Group>
          {index < Object.values(mergedBreakdowns).length - 1 && <Divider look="soft" horizontal />}
        </Group>
      ) : (
        <Group key={token.id}>
          <Token token={token} amount={amount} />
        </Group>
      ),
    );
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
