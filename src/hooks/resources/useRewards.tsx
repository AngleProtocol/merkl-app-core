import type { Reward } from "@merkl/api";
import { Fmt } from "dappkit";
import { useMemo } from "react";
import { getAddress, isAddress } from "viem";
import merklConfig from "../../config";

function getValueOf(chainRewards: Reward["rewards"], amount: (t: Reward["rewards"][number]) => bigint) {
  return chainRewards.reduce((sum: number, reward) => {
    if (isAddress(merklConfig.rewardsTotalClaimableMode ?? "")) {
      if (reward.token.address === getAddress(merklConfig.rewardsTotalClaimableMode ?? "")) {
        return sum + Number.parseFloat(amount(reward).toString());
      }
      return sum;
    }
    return sum + Fmt.toPrice(amount(reward), reward.token);
  }, 0);
}

export default function useRewards(rewards: Reward[]) {
  const { earned, unclaimed, pending } = useMemo(() => {
    return rewards.reduce(
      ({ earned, unclaimed, pending }, chain) => {
        const valueUnclaimed = getValueOf(chain.rewards, token => token.amount - token.claimed);
        const valueEarned = getValueOf(chain.rewards, token => token.amount);
        const valuePending = getValueOf(chain.rewards, token => token.pending);
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
  }, [rewards]);

  const sortedRewards = useMemo(() => {
    return rewards.sort((a, b) => {
      const unclaimedA = getValueOf(a.rewards, token => token.amount - token.claimed);
      const unclaimedB = getValueOf(b.rewards, token => token.amount - token.claimed);

      return unclaimedB - unclaimedA;
    });
  }, [rewards]);

  return { earned, unclaimed, sortedRewards, pending };
}
