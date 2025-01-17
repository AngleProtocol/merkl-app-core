import merklConfig from "@core/config";
import type { Token } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Fmt, Icon, Icons, Text, Title, Value } from "dappkit";
import { useMemo } from "react";

const rewards = [
  "name",
  "identifier",
  "action",
  "status",
  "type",
  "protocol",
  "dailyRewards",
  "depositUrl",
  "chain",
  "tokens",
  "rewardsRecord",
] satisfies (keyof Opportunity)[];

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityRewards({
  dailyRewards,
  rewardsRecord,
}: Pick<Opportunity, (typeof rewards)[number]>) {
  /**
   * Icons for each rewarded tokens of the opportunity
   */
  const rewardIcons = useMemo(
    () =>
      rewardsRecord?.breakdowns?.map(({ token: { icon, address } }) => {
        return <Icon key={address} rounded src={icon} />;
      }) ?? [],
    [rewardsRecord],
  );

  /**
   * Picks tokens and amounts from the rewards breakdown
   */
  const rewardsBreakdown = useMemo(() => {
    if (!rewardsRecord?.breakdowns) return [];

    const tokenAddresses = rewardsRecord.breakdowns.reduce((addresses, breakdown) => {
      return addresses.add(breakdown.token.address);
    }, new Set<string>());

    return Array.from(tokenAddresses).map(address => {
      const breakdowns = rewardsRecord.breakdowns.filter(({ token: t }) => t.address === address);
      const amount = breakdowns?.reduce((sum, breakdown) => sum + BigInt(breakdown.amount), 0n);

      return { token: breakdowns?.[0]?.token, amount } satisfies {
        token: Token;
        amount: bigint;
      };
    });
  }, [rewardsRecord]);

  /**
   * Formatted daily rewards displayed
   */
  const formattedDailyRewards = useMemo(() => {
    if (merklConfig.opportunity.library.dailyRewardsTokenAddress) {
      const breakdowns = rewardsRecord.breakdowns.filter(
        ({ token }) => token?.address === merklConfig.opportunity.library.dailyRewardsTokenAddress,
      );
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => acc + breakdown.amount, 0n);

      return (
        <>
          <Title h={3} size={3} look="soft">
            <Value value format={"0,0.##a"}>
              {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
            </Value>

            {token?.symbol && ` ${token?.symbol}`}
          </Title>
          <Text className="text-xl">
            <Icon key={token?.icon} src={token?.icon} />
          </Text>
        </>
      );
    }
    return (
      <>
        <Title h={3} size={3} look="soft">
          <Value value format={merklConfig.decimalFormat.dollar}>
            {dailyRewards ?? 0}
          </Value>
        </Title>
        <Title h={4}>
          <Icons>{rewardIcons}</Icons>
        </Title>
      </>
    );
  }, [rewardsRecord, dailyRewards, rewardIcons]);

  return {
    rewardIcons,
    rewardsBreakdown,
    formattedDailyRewards
  };
}
