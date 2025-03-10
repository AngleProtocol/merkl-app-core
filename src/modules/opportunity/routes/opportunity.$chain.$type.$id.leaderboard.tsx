import LeaderboardLibrary from "@core/components/element/leaderboard/LeaderboardLibrary";
import merklConfig from "@core/config";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import { CampaignService } from "@core/modules/campaigns/campaign.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { RewardService } from "@core/modules/reward/reward.service";
import Token from "@core/modules/token/components/element/Token";
import type { Campaign } from "@merkl/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Box,
  Container,
  Group,
  Icon,
  OverrideTheme,
  PrimitiveTag,
  Select,
  Space,
  Text,
  Time,
  Title,
  Value,
} from "dappkit";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { formatUnits, parseUnits } from "viem";

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });
  const campaignId = new URL(request.url).searchParams.get("campaignId");

  const campaigns = await CampaignService.getByOpportunity(undefined, {
    chainId: chain.id,
    type: type as Campaign["type"],
    mainParameter: id,
  });

  const selectedCampaign = campaigns?.find(campaign => campaign?.campaignId === campaignId) ?? campaigns?.[0];
  const computeChain = await ChainService.getById(selectedCampaign?.computeChainId ?? chain.id);

  const { rewards, count, total } = await RewardService.getCampaignLeaderboard(request, {
    chainId: selectedCampaign.distributionChainId,
    campaignId: selectedCampaign.campaignId,
  });

  return {
    computeChain,
    rewards,
    campaigns,
    count,
    total,
    selectedCampaign,
  };
}

export default function Index() {
  const { rewards, campaigns, count, total, selectedCampaign, computeChain } = useLoaderData<typeof loader>();

  const [campaignId, setCampaignIds] = useSearchParamState<string>(
    "campaignId",
    v => v,
    v => v,
  );

  const totalRewardsInUsd = useMemo(() => {
    const amountUSD = formatUnits(total, selectedCampaign?.rewardToken.decimals);
    return Number.parseFloat(amountUSD) * (selectedCampaign?.rewardToken?.price ?? 0);
  }, [total, selectedCampaign]);

  // --------------- Campaign utils ---------------

  const dailyRewards = useCallback((campaign: Campaign) => {
    const duration = campaign.endTimestamp - campaign.startTimestamp;
    const oneDayInSeconds = BigInt(3600 * 24);
    const dayspan = BigInt(duration) / BigInt(oneDayInSeconds) || BigInt(1);
    const amountInUnits = parseUnits(campaign.amount, 0);
    const dailyReward = amountInUnits / dayspan;

    return dailyReward;
  }, []);

  // -------------------------------------------

  const campaignsOptions = campaigns?.reduce(
    (options, campaign: Campaign) => {
      if (!campaign) return options;
      const isActive = BigInt(campaign.endTimestamp) > BigInt(moment().unix());
      options[campaign.campaignId] = (
        <Group className="items-center">
          <OverrideTheme accent={"good"}>
            <Icon className={isActive ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" />
          </OverrideTheme>

          <PrimitiveTag size="sm" look={isActive ? "bold" : "soft"}>
            {isActive && <Icon remix="RiFlashlightFill" />}
            {"End "}
            <Time timestamp={Number(campaign.endTimestamp) * 1000} />
          </PrimitiveTag>

          <Token token={campaign.rewardToken} amount={dailyRewards(campaign)} format="amount_price" value />
        </Group>
      );
      return options;
    },
    {} as Record<string, React.ReactNode>,
  );

  const metrics = useMemo(
    () =>
      (
        [
          [
            "Total Rewarded Users",
            <Value value key="users" format="0">
              {count?.count}
            </Value>,
          ],
          [
            "Total Rewards Distributed",
            <Value value key="users" format={merklConfig.decimalFormat.dollar}>
              {totalRewardsInUsd}
            </Value>,
          ],
          [
            "Last Update",

            <Text key="updated">
              {selectedCampaign?.campaignStatus?.computedUntil ? (
                <Time timestamp={Number(selectedCampaign?.campaignStatus?.computedUntil) * 1000} />
              ) : (
                "Never"
              )}
            </Text>,
          ],
        ] as const
      ).map(([label, value]) => (
        <Box
          key={label}
          look="soft"
          size="lg"
          content="xs"
          className="justify-between !p-xl items-center flex-row border-2 bg-main-0 border-main-8 flex-1">
          <Title h={3} size="lg" look="soft" className="uppercase font-bold">
            {label}
          </Title>
          {/* Probably a count from api */}
          <Title h={3}>{value}</Title>
        </Box>
      )),
    [totalRewardsInUsd, count, selectedCampaign],
  );

  return (
    <Container>
      <Select
        className="w-full"
        size="xl"
        look="tint"
        options={campaignsOptions}
        state={[campaignId, id => setCampaignIds(id as string)]}
        placeholder={!!campaignId ? "Campaign Selected" : "Please select a campaign"}
      />

      <Space size="lg" />
      <Group size="lg">{metrics}</Group>
      <Space size="lg" />
      {selectedCampaign && (
        <LeaderboardLibrary
          reason={true}
          leaderboard={rewards}
          token={selectedCampaign?.rewardToken}
          chain={computeChain}
          count={count?.count ?? 0}
          total={total}
        />
      )}
    </Container>
  );
}
