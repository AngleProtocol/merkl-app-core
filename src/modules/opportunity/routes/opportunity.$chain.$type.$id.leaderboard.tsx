import type { Campaign } from "@merkl/api";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
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
import LeaderboardLibrary from "../../../components/element/leaderboard/LeaderboardLibrary";
import Token from "../../../components/element/token/Token";
import merklConfig from "../../../config";
import useSearchParamState from "../../../hooks/filtering/useSearchParamState";
import { Cache } from "../../../modules/cache/cache.service";
import { CampaignService } from "../../../modules/campaigns/campaign.service";
import { ChainService } from "../../../modules/chain/chain.service";
import { RewardService } from "../../../modules/reward/reward.service";

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });
  const campaignId = new URL(request.url).searchParams.get("campaignId");

  const campaigns = await CampaignService.getByOpportunity(request, {
    chainId: chain.id,
    type: type as Campaign["type"],
    mainParameter: id,
  });

  const selectedCampaign = campaigns?.find(campaign => campaign?.campaignId === campaignId) ?? campaigns?.[0];

  const { rewards, count, total } = await RewardService.getCampaignLeaderboard(request, {
    chainId: selectedCampaign.distributionChainId,
    campaignId: selectedCampaign.campaignId,
  });

  return json({
    rewards,
    campaigns,
    count,
    total,
    selectedCampaign,
  });
}

export const clientLoader = Cache.wrap("opportunity/leaderboard", 300);

export default function Index() {
  const { rewards, campaigns, count, total, selectedCampaign } = useLoaderData<typeof loader>();

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

          <PrimitiveTag look={isActive ? "bold" : "soft"}>
            {isActive && <Icon remix="RiFlashlightFill" />}
            {"End "}
            <Time timestamp={Number(campaign.endTimestamp) * 1000} />
          </PrimitiveTag>

          <Group>
            <Token token={campaign.rewardToken} amount={dailyRewards(campaign)} format="amount_price" value />
          </Group>
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
          <Title h={3} size="lg" className="!text-main-11 uppercase font-bold">
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
      <Box content="xl" size="md">
        <Select
          size="xl"
          look="bold"
          options={campaignsOptions}
          state={[campaignId, id => setCampaignIds(id as string)]}
          placeholder={!!campaignId ? "Campaign Selected" : "Please select a campaign"}
        />
      </Box>
      <Space size="lg" />
      <Group size="lg">{metrics}</Group>
      <Space size="lg" />
      {selectedCampaign && (
        <LeaderboardLibrary
          reason={true}
          leaderboard={rewards}
          token={selectedCampaign?.rewardToken}
          chain={selectedCampaign?.computeChainId}
          count={count?.count ?? 0}
          total={total}
        />
      )}
    </Container>
  );
}
