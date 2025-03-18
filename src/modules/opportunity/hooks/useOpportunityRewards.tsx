import { useMerklConfig } from "@core/modules/config/config.context";
import type { Token } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Fmt, Group, Icon, Text, Value } from "dappkit";
import { useMemo } from "react";

const rewards = ["dailyRewards", "rewardsRecord"] satisfies (keyof Opportunity)[];

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityRewards({
  dailyRewards,
  rewardsRecord,
}: Pick<Opportunity, (typeof rewards)[number]>) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const dailyRewardsTokenAddress = useMerklConfig(store => store.config.opportunity.library.dailyRewardsTokenAddress);
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
    if (dailyRewardsTokenAddress) {
      const breakdowns = rewardsRecord.breakdowns.filter(({ token }) => token?.address === dailyRewardsTokenAddress);
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => BigInt(acc) + BigInt(breakdown.amount), 0n);

      return (
        <>
          <Text bold look="soft">
            <Value value format={"0,0.##a"}>
              {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
            </Value>

            {token?.symbol && ` ${token?.symbol}`}
          </Text>
          <Text className="text-lg">
            <Icon key={token?.icon} src={token?.icon} />
          </Text>
        </>
      );
    }

    const tokens = rewardsRecord.breakdowns.reduce<Token[]>((acc, { token }) => {
      if (!acc.some(t => t.id === token.id)) acc.push(token);
      return acc;
    }, []);

    return (
      <Group className="flex items-center" size="sm">
        <Text bold look="hype" size="lg">
          <Value value format={dollarFormat}>
            {dailyRewards ?? 0}
          </Value>
        </Text>
        <Group className="relative">
          <Group className="flex items-center !gap-0">
            {tokens.map((token, index) => {
              const zIndex = (tokens.length - index) * 10;
              return (
                <Icon
                  key={token.address}
                  size="sm"
                  rounded
                  src={token?.icon}
                  className={`inline-block ${index !== 0 && "-ml-sm*2"} z-${zIndex}`}
                />
              );
            })}
          </Group>
        </Group>
      </Group>
    );
  }, [rewardsRecord, dailyRewards, dollarFormat, dailyRewardsTokenAddress]);

  return {
    rewardsBreakdown,
    formattedDailyRewards,
    dailyRewards,
  };
}
