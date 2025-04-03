import type { Reward } from "@merkl/api";
import { type Component, Title } from "dappkit";
import { Fmt } from "dappkit";
import { useMemo, useState } from "react";

import { ClaimRewardsTableByOpportunity } from "./ClaimRewardsTableByOpportunity";
import ClaimRewardsTokenTableRowByOpportunity from "./ClaimRewardsTokenTableRowByOpportunity";

type LocalReward = {
  chain: Reward["chain"];
  distributor: Reward["distributor"];
  breakdown: Reward["rewards"][number]["breakdowns"][number];
  token: Reward["rewards"][number]["token"];
};

export type claimRewardsByOpportunityProps = Component<{
  from: string;
  rewards: LocalReward[];
}>;

export default function ClaimRewardsByOpportunity({ from, rewards }: claimRewardsByOpportunityProps) {
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set<string>());

  const renderTokenRewards = useMemo(() => {
    return rewards
      ?.sort((a, b) => {
        const priceA = Fmt.toPrice(a.breakdown.amount - a.breakdown.claimed, a.token);
        const priceB = Fmt.toPrice(b.breakdown.amount - b.breakdown.claimed, b.token);

        if (b.breakdown.amount === b.breakdown.claimed && a.breakdown.amount === a.breakdown.claimed)
          return Fmt.toPrice(b.breakdown.amount, b.token) - Fmt.toPrice(a.breakdown.amount, a.token);
        return priceB - priceA;
      })
      .map(_reward => (
        <ClaimRewardsTokenTableRowByOpportunity
          key={_reward.token.address}
          className="cursor-pointer [&>*>*]:cursor-auto"
          checkedState={[
            selectedTokens.has(_reward.token.address) || !selectedTokens.size,
            () => {
              setSelectedTokens(t => {
                if (!t.has(_reward.token.address)) t.add(_reward.token.address);
                else t.delete(_reward.token.address);

                return new Set(t);
              });
            },
          ]}
          breakdown={_reward.breakdown}
          token={_reward.token}
          distributor={_reward.distributor}
          from={from}
        />
      ));
  }, [rewards, selectedTokens.size, selectedTokens, from]);

  return (
    <ClaimRewardsTableByOpportunity
      responsive
      className="[&>*]:bg-main-4"
      look="soft"
      dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
      header={
        <Title h={5} look="soft" className="w-full">
          Your Rewards
        </Title>
      }>
      {renderTokenRewards}
    </ClaimRewardsTableByOpportunity>
  );
}
