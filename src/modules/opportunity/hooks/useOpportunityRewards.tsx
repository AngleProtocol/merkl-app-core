import { useMerklConfig } from "@core/modules/config/config.context";
import type { Token } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Fmt, FormatterService, Group, Icon, Text, Value } from "dappkit";
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

  const formattedDailyRewardsText = useMemo(() => {
    if (!rewardsRecord?.breakdowns) return;

    if (dailyRewardsTokenAddress) {
      const breakdowns = rewardsRecord.breakdowns.filter(({ token }) => token?.address === dailyRewardsTokenAddress);
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => BigInt(acc) + BigInt(breakdown.amount), 0n);

      return (
        <>
          <Value value format={"0,0.##a"}>
            {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
          </Value>

          {token?.symbol && ` ${token?.symbol}`}
        </>
      );
    }

    const tokens = rewardsRecord?.breakdowns.reduce<Token[]>((acc, { token }) => {
      if (!acc.some(t => t.id === token.id)) acc.push(token);
      return acc;
    }, []);

    return (
      <>
        {tokens.some(token => token.isPreTGE) && "~"}
        <Value value format={dollarFormat}>
          {dailyRewards ?? 0}
        </Value>
      </>
    );
  }, [rewardsRecord, dailyRewards, dollarFormat, dailyRewardsTokenAddress]);

  /**
   * Formatted daily rewards displayed
   */
  const formattedDailyRewards = useMemo(() => {
    if (!rewardsRecord?.breakdowns) return;

    if (dailyRewardsTokenAddress) {
      const breakdowns = rewardsRecord.breakdowns.filter(({ token }) => token?.address === dailyRewardsTokenAddress);
      const token = breakdowns?.[0]?.token;

      return (
        <>
          <Text bold look="soft">
            {formattedDailyRewardsText}
          </Text>
          <Text className="text-lg">
            <Icon key={token?.icon} src={token?.icon} />
          </Text>
        </>
      );
    }

    const tokens = rewardsRecord?.breakdowns.reduce<Token[]>((acc, { token }) => {
      if (!acc.some(t => t.id === token.id)) acc.push(token);
      return acc;
    }, []);

    return (
      <Group className="flex items-center" size="sm">
        <Text bold look="hype" size="lg">
          {formattedDailyRewardsText}
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
  }, [rewardsRecord, dailyRewardsTokenAddress, formattedDailyRewardsText]);

  /**
   * Determines if the opportunity has only reward token points
   */
  const isOnlyPoint = useMemo(() => {
    if (!rewardsRecord?.breakdowns.length) return false;
    return rewardsRecord?.breakdowns.every(breakdown => breakdown.token.isPoint === true);
  }, [rewardsRecord]);

  /**
   * SINGLE Point aggregation (will be refacto to handles multiple points on the same opportunity) test token excluded
   */
  const pointAggregation = useMemo(() => {
    if (!isOnlyPoint) return null;
    return rewardsRecord?.breakdowns.reduce((acc, record) => {
      if (record.token.isTest) return acc;
      return acc + FormatterService.toNumber(record.amount, record.token.decimals);
    }, 0);
  }, [isOnlyPoint, rewardsRecord]);

  return {
    rewardsBreakdown,
    formattedDailyRewardsText,
    formattedDailyRewards,
    dailyRewards,
    isOnlyPoint,
    pointAggregation,
  };
}
