import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { type MetaFunction, useLoaderData } from "@remix-run/react";
import { Box, Container, Group, Space, Title, Value } from "dappkit";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import LeaderboardLibrary from "../../../components/element/leaderboard/LeaderboardLibrary";
import merklConfig from "../../../config";
import { ChainService } from "../../chain/chain.service";
import { RewardService } from "../../reward/reward.service";
import { TokenService } from "../../token/token.service";

export async function loader({ params: { address, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId && !merklConfig.leaderboard) throw "";
  if (!chainId) chainId = merklConfig.leaderboard!.chain;

  if (!address && !merklConfig.leaderboard) throw "";
  if (!address) address = merklConfig.leaderboard!.address;

  const chain = await ChainService.get({ name: chainId });
  const token = await TokenService.findUniqueOrThrow(chain.id, address);

  const { rewards, count, total } = await RewardService.getTokenLeaderboard(request, {
    chainId: chain.id,
    address,
  });

  return json({
    rewards,
    token,
    chain,
    count,
    total,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data: _data }) => {
  return [{ title: I18n.trad.get.pages.leaderboard.headTitle }];
};

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
    <Hero
      breadcrumbs={[
        { link: "/tokens", name: "Tokens" },
        { link: `/tokens/${token.symbol}`, name: token.symbol },
      ]}
      icons={[{ src: token.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <>
          {token.name} <span className="font-mono text-main-8">({token.symbol})</span>
        </>
      }
      description={`Leaderboard of all ${token.symbol} rewards earned through Merkl`}>
      <Container>
        <Space size="lg" />
        <Group size="lg">{metrics}</Group>
        <Space size="lg" />
        <LeaderboardLibrary
          reason={false}
          leaderboard={rewards}
          token={token}
          chain={chain.id}
          count={count?.count ?? 0}
          total={total}
        />
      </Container>
      <Space size="lg" />
    </Hero>
  );
}
