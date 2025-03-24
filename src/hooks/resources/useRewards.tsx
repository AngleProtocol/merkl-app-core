import { useMerklConfig } from "@core/modules/config/config.context";
import type { Reward } from "@merkl/api";
import { Fmt } from "dappkit";
import { useMemo } from "react";
import { getAddress, isAddress } from "viem";

function getValueOf(
  rewardsTotalClaimableMode: string | undefined,
  chainRewards: Reward["rewards"],
  amount: (t: Reward["rewards"][number]) => bigint,
) {
  return chainRewards.reduce((sum: number, reward) => {
    if (isAddress(rewardsTotalClaimableMode ?? "")) {
      if (reward.token.address === getAddress(rewardsTotalClaimableMode ?? "")) {
        return sum + Number.parseFloat(amount(reward).toString());
      }
      return sum;
    }
    return sum + Fmt.toPrice(amount(reward), reward.token);
  }, 0);
}

export default function useRewards(rewards: Reward[]) {
  const rewardsTotalClaimableMode = useMerklConfig(store => store.config.rewardsTotalClaimableMode);
  const { earned, unclaimed, pending } = useMemo(() => {
    return rewards.reduce(
      ({ earned, unclaimed, pending }, chain) => {
        const valueUnclaimed = getValueOf(
          rewardsTotalClaimableMode,
          chain.rewards,
          token => token.amount - token.claimed,
        );
        const valueEarned = getValueOf(rewardsTotalClaimableMode, chain.rewards, token => token.amount);
        const valuePending = getValueOf(rewardsTotalClaimableMode, chain.rewards, token => token.pending);
        return {
          earned: earned + valueEarned,
          unclaimed: unclaimed + valueUnclaimed,
          pending: pending + valuePending,
        };
      },
      {
        earned: 0,
        unclaimed: 0,
        pending: 0,
      },
    );
  }, [rewards, rewardsTotalClaimableMode]);

  const sortedRewards = useMemo(() => {
    return rewards.sort((a, b) => {
      const unclaimedA = getValueOf(rewardsTotalClaimableMode, a.rewards, token => token.amount - token.claimed);
      const unclaimedB = getValueOf(rewardsTotalClaimableMode, b.rewards, token => token.amount - token.claimed);

      return unclaimedB - unclaimedA;
    });
  }, [rewards, rewardsTotalClaimableMode]);

  /**
   * Determines if the opportunity has only reward token points
   */
  const isOnlyPointOrTest = useMemo(() => {
    return rewards.every(rewardsPerChain =>
      rewardsPerChain.rewards.every(reward => !!reward.token.isPoint || !!reward.token.isTest),
    );
  }, [rewards]);

  /**
   * SINGLE Point aggregation (will be refacto to handlesmultiple point on sameopportunity) test tokensa are excluded
   */
  const pointAggregation = useMemo(() => {
    if (!isOnlyPointOrTest) return null;

    return rewards.reduce(
      (totals, rewardsPerChain) => {
        rewardsPerChain.rewards.forEach(record => {
          if (!record.token.isTest) {
            totals.unclaimed += Fmt.toNumber(record.amount - record.claimed, record.token.decimals);
            totals.total += Fmt.toNumber(record.amount, record.token.decimals);
          }
        });
        return totals;
      },
      { unclaimed: 0, total: 0 },
    );
  }, [isOnlyPointOrTest, rewards]);

  return { earned, unclaimed, sortedRewards, pending, isOnlyPointOrTest, pointAggregation };
}
