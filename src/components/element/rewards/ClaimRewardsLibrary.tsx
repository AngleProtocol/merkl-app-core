import type { Reward } from "@merkl/api";
import { Group, Text } from "dappkit";
import type { TransactionButtonProps } from "dappkit";
import { useMemo } from "react";
import merklConfig from "../../../config";
import { ClaimRewardsChainTable } from "./ClaimRewardsChainTable";
import ClaimRewardsChainTableRow from "./ClaimRewardsChainTableRow";
import ClaimRewardsByOpportunity from "./byOpportunity/ClaimRewardsByOpportunity";

export type ClaimRewardsLibraryProps = {
  rewards: Reward[];
  from: string;
  onClaimSuccess: TransactionButtonProps["onSuccess"];
};

export default function ClaimRewardsLibrary({ from, rewards, onClaimSuccess }: ClaimRewardsLibraryProps) {
  const flatenedRewards = useMemo(
    () =>
      rewards.flatMap(({ chain, rewards, distributor }) =>
        rewards.flatMap(reward =>
          reward.breakdowns.flatMap(breakdown => ({ chain, distributor, breakdown, token: reward.token })),
        ),
      ),
    [rewards],
  );

  const renderRewards = useMemo(() => {
    switch (merklConfig.rewardsNavigationMode) {
      case "opportunity":
        return <ClaimRewardsByOpportunity from={from} rewards={flatenedRewards} />;
      default:
        return (
          <ClaimRewardsChainTable dividerClassName={index => (index === 1 ? "bg-gray-10" : "bg-accent-7")}>
            {rewards?.map((reward, index) => (
              <ClaimRewardsChainTableRow
                {...{ from, reward }}
                key={reward.chain?.id ?? index}
                onClaimSuccess={onClaimSuccess}
              />
            ))}
          </ClaimRewardsChainTable>
        );
    }
  }, [rewards, flatenedRewards, from, onClaimSuccess]);

  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      {rewards?.length > 0 ? renderRewards : <Text>No reward detected</Text>}
    </Group>
  );
}
