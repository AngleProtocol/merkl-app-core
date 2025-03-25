import type { Opportunity } from "@merkl/api";
import { type Component, Fmt, Group, Icon, Text, Value } from "packages/dappkit/src";
import { useMemo } from "react";

export type OpportunityTableAmountRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityTableAmountRewards({
  opportunity,
  size: _,
}: Component<OpportunityTableAmountRewardsProps>) {
  const { token, breakdownAmount } = useMemo(() => {
    if (!opportunity.rewardsRecord) return { token: undefined, breakdownAmount: 0n };
    const tokenAddress = opportunity.rewardsRecord.breakdowns?.[0]?.token?.address;
    const breakdowns = opportunity.rewardsRecord.breakdowns.filter(({ token }) => token?.address === tokenAddress);
    const breakdownToken = breakdowns?.[0]?.token;
    const breakdownAmount = breakdowns.reduce((acc, breakdown) => BigInt(acc) + BigInt(breakdown.amount), 0n);

    return { token: breakdownToken, breakdownAmount };
  }, [opportunity]);

  return (
    <Group size="sm" className="flex-nowrap items-center">
      <Text look="hype" bold size="lg">
        <Value value format={"0.###a"}>
          {Fmt.toNumber(breakdownAmount, token?.decimals)}
        </Value>
      </Text>
      <Icon src={token?.icon} />
    </Group>
  );
}
