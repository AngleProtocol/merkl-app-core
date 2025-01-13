import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Box, Container, Group, Space, Title, Value } from "dappkit";
import config from "merkl.config";
import { useMemo } from "react";
import { ChainService } from "src/api/services/chain.service";
import { RewardService } from "src/api/services/reward.service";
import { TokenService } from "src/api/services/token.service";
import Hero from "src/components/composite/Hero";
import LeaderboardLibrary from "src/components/element/leaderboard/LeaderboardLibrary";
import { formatUnits } from "viem";

export async function loader({ params: { address, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !address) throw "";

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
            <Value value key="users" format={config.decimalFormat.dollar}>
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
      description={`Leaderboard of all ${token.symbol} rewards earned through Merkl`}
      // sideDatas={defaultHeroSideDatas(count, maxApr, Number.parseFloat(dailyRewards))}
      // tags={tags.map(tag => <Tag key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="lg" />)}
    >
      <Container>
        <Space size="lg" />
        <Group size="lg">{metrics}</Group>
        <Space size="lg" />
        <LeaderboardLibrary
          withReason={false}
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
