import type { BreakdownForCampaignsRaw } from "@merkl/api/dist/src/modules/v4/reward";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Box, Container, Group, Space, Title, Value } from "dappkit";
import { useMemo } from "react";
import { formatUnits } from "viem";
import LeaderboardLibrary from "../../../components/element/leaderboard/LeaderboardLibrary";
import merklConfig from "../../../config";
import { Cache } from "../../../modules/cache/cache.service";
import { RewardService } from "../../reward/reward.service";
import { extractChainAndTokenFromParams } from "./leaderboard.($chain).($address).header";

export async function loader({ params: { address, chain: chainName }, request }: LoaderFunctionArgs) {
  const { chain, token } = await extractChainAndTokenFromParams(address, chainName);

  const { rewards, count, total } = await RewardService.getTokenLeaderboard(request, {
    chainId: chain.id,
    address: token.address,
  });

  return {
    rewards,
    token,
    chain,
    count,
    total,
  };
}

export const clientLoader = Cache.wrap("leaderboard", 300);

export default function Index() {
  const { rewards, token, chain, count, total } = useLoaderData<typeof loader>();

  const totalRewardsInUsd = useMemo(() => {
    const amountUSD = formatUnits(total, token.decimals);
    return Number.parseFloat(amountUSD) * (token?.price ?? 0);
  }, [total, token]);

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
    [totalRewardsInUsd, count],
  );

  return (
    <Container>
      <Space size="lg" />
      <Group size="lg">{metrics}</Group>
      <Space size="lg" />
      {token && (
        <LeaderboardLibrary
          reason={false}
          //TODO: unionize or abstract leaderboard type, or recreate a leaderboard component to handle type
          leaderboard={rewards as BreakdownForCampaignsRaw[]}
          token={token}
          chain={chain}
          count={count?.count ?? 0}
          total={total}
        />
      )}
      <Space size="lg" />
    </Container>
  );
}
