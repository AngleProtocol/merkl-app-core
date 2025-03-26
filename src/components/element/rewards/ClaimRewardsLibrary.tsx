import { useMerklConfig } from "@core/modules/config/config.context";
import type { Reward } from "@merkl/api";
import { Box, Group, Icon, Space, Text } from "dappkit";
import type { TransactionButtonProps } from "dappkit";
import { useMemo } from "react";
import { ClaimRewardsChainTable } from "./ClaimRewardsChainTable";
import ClaimRewardsChainTableRow from "./ClaimRewardsChainTableRow";
import ClaimRewardsByOpportunity from "./byOpportunity/ClaimRewardsByOpportunity";

export type ClaimRewardsLibraryProps = {
  rewards: Reward[];
  from: string;
  onClaimSuccess: TransactionButtonProps["onSuccess"];
};

export default function ClaimRewardsLibrary({ from, rewards, onClaimSuccess }: ClaimRewardsLibraryProps) {
  const rewardsNavigationMode = useMerklConfig(store => store.config.rewardsNavigationMode);

  const flattenedRewards = useMemo(
    () =>
      rewards.flatMap(({ chain, rewards, distributor }) =>
        rewards.flatMap(reward =>
          reward.breakdowns.flatMap(breakdown => ({ chain, distributor, breakdown, token: reward.token })),
        ),
      ),
    [rewards],
  );

  const renderRewards = useMemo(() => {
    switch (rewardsNavigationMode) {
      case "opportunity":
        return <ClaimRewardsByOpportunity from={from} rewards={flattenedRewards} />;
      default:
        return (
          <ClaimRewardsChainTable
            header={<Text className="uppercase font-bold">Tokens earned</Text>}
            dividerClassName={() => "bg-main-6"}>
            {rewards?.length > 0 ? (
              rewards?.map((reward, index) => (
                <ClaimRewardsChainTableRow
                  {...{ from, reward }}
                  key={reward.chain?.id ?? index}
                  onClaimSuccess={onClaimSuccess}
                />
              ))
            ) : (
              <Box>
                <Space size="xl" />
                <Text className="flex flex-nowrap justify-center w-full gap-md">
                  <Icon remix="RiForbid2Fill" />
                  No rewards found
                </Text>
                <Space size="xl" />
              </Box>
            )}
          </ClaimRewardsChainTable>
        );
    }
  }, [rewards, flattenedRewards, from, onClaimSuccess, rewardsNavigationMode]);

  return <Group className="flex-row w-full [&>*]:flex-grow">{renderRewards}</Group>;
}
