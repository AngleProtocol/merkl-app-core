import { api } from "@core/api";
import { ChainService, TokenService } from "@core/index.generated";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { BreakdownForCampaignsRaw } from "@merkl/api/dist/src/modules/v4/reward/reward.model";
import { Box, Container, Group, Space, Title, Value } from "dappkit";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { formatUnits } from "viem";
import LeaderboardLibrary from "../../../components/element/leaderboard/LeaderboardLibrary";
import { Cache } from "../../../modules/cache/cache.service";
import { RewardService } from "../../reward/reward.service";

export async function loader({
  context: { backend },
  params: { address, chain: chainName },
  request,
}: LoaderFunctionArgs) {
  if (!chainName && !backend.leaderboard) throw "";
  if (!chainName) chainName = backend.leaderboard!.chain;

  if (!address && !backend.leaderboard) throw "";
  if (!address) address = backend.leaderboard!.address;

  const chain = await ChainService({ api, backend, request }).get({ name: chainName });
  const token = await TokenService({ api }).findUniqueOrThrow(chain.id, address!);

  const { rewards, count, total } = await RewardService({ api, backend, request }).getTokenLeaderboard({
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
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

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
            <Value value key="users" format={dollarFormat}>
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
          <Title h={3} size="lg" look="soft" className="uppercase font-bold">
            {label}
          </Title>
          {/* Probably a count from api */}
          <Title h={3}>{value}</Title>
        </Box>
      )),
    [totalRewardsInUsd, count, dollarFormat],
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
