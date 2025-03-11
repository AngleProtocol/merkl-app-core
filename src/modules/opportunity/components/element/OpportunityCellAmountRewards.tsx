import type { Opportunity } from "@merkl/api";
import { type Component, Fmt, Group, Icon, Text, Value } from "packages/dappkit/src";
import { useMemo } from "react";

export type OpportunityCellAmountRewardsProps = {
  opportunity: Opportunity;
  format?: string;
};

export default function OpportunityCellAmountRewards({
  opportunity,
  size: _,
}: Component<OpportunityCellAmountRewardsProps>) {
  const [token, amount] = useMemo(() => {
    const tokenAddress = opportunity.rewardsRecord.breakdowns?.[0]?.token?.address;
    const breakdowns = opportunity.rewardsRecord.breakdowns.filter(({ token }) => token?.address === tokenAddress);
    const token = breakdowns?.[0]?.token;
    const breakdownAmount = breakdowns.reduce((acc, breakdown) => BigInt(acc) + BigInt(breakdown.amount), 0n);

    return [token, breakdownAmount];
  }, [opportunity]);

  return (
    <Group size="sm">
      <Text look="hype" bold size="lg">
        <Value value format={"0.###a"}>
          {Fmt.toNumber(amount, token.decimals)}
        </Value>
      </Text>
      <Icon src={token.icon} />
    </Group>
  );
}
