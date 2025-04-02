import { api } from "@core/api";
import LeaderboardLibrary from "@core/components/element/leaderboard/LeaderboardLibrary";
import { CampaignService } from "@core/modules/campaigns/campaign.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { RewardService } from "@core/modules/reward/reward.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { Box, Button, Group, Hash, Icon, Text } from "packages/dappkit/src";
import { useCallback } from "react";
import useOpportunityMetadata from "../hooks/useOpportunityMetadata";
import type { OutletContextOpportunity } from "./opportunity.$chain.$type.$id.header";

export async function loader({
  context: { backend },
  params: { id, type, chain: chainId },
  request,
}: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService({ api, request, backend }).get({ name: chainId });
  const campaignId = new URL(request.url).searchParams.get("campaignId");

  // TODO Need to be replace by findFisrt campaign by id
  const campaigns = await CampaignService({ backend, api }).getByOpportunity({
    campaignId: campaignId ?? "",
  });

  const selectedCampaign = campaigns[0];
  // --------
  const computeChain = await ChainService({ api }).getById(selectedCampaign?.computeChainId ?? chain.id);

  const { rewards, count, total } = await RewardService({ backend, api, request }).getCampaignLeaderboard({
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
  const { rewards, count, total, selectedCampaign, computeChain } = useLoaderData<typeof loader>();
  const { opportunity } = useOutletContext<OutletContextOpportunity>();

  const { link } = useOpportunityMetadata(opportunity);

  const navigate = useNavigate();

  const backToOpportunity = useCallback(() => {
    navigate(link);
  }, [navigate, link]);

  return (
    <Box className="w-full">
      <LeaderboardLibrary
        reason={true}
        leaderboard={rewards}
        token={selectedCampaign?.rewardToken}
        chain={computeChain}
        count={count?.count ?? 0}
        total={total}
        header={
          <Group className="justify-between w-full pb-md">
            <Group className="gap-md items-center">
              <Button bold onClick={backToOpportunity} look="soft" size="xs">
                <Icon remix="RiArrowLeftLine" /> Back
              </Button>
              <Text bold>LEADERBOARD</Text>
            </Group>
            <Text bold className="flex items-center">
              CAMPAIGN #
              <Hash format="prefix" copy>
                {selectedCampaign.campaignId}
              </Hash>
            </Text>
          </Group>
        }
      />
    </Box>
  );
}
