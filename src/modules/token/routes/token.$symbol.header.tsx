import { api } from "@core/api";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import Hero, { defaultHeroSideDatas } from "../../../components/composite/Hero";
import { Cache } from "../../../modules/cache/cache.service";
import { ChainService } from "../../../modules/chain/chain.service";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";
import { TokenService } from "../../../modules/token/token.service";

export async function loader({ context: { backend, routes }, params: { symbol }, request }: LoaderFunctionArgs) {
  const tokens = await TokenService({ backend, request, api }).getSymbol(symbol);
  const chains = await ChainService({ api }).getAll();
  const opportunityService = OpportunityService({ api, request, backend });

  const { opportunities: opportunitiesByApr, count } = await opportunityService.getMany({
    tokens: symbol,
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum: dailyRewards } = await opportunityService.getAggregate({ tokens: symbol }, "dailyRewards");

  return {
    tokens,
    chains,
    dailyRewards,
    maxApr: opportunitiesByApr?.[0]?.apr,
    count,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export const clientLoader = Cache.wrap("token", 300);

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { tokens, dailyRewards, count, maxApr } = useLoaderData<typeof loader>();
  const token = tokens?.[0];

  // Have been disabled with @Pablo
  // const tags = useMemo(() => {
  //   return tokens
  //     .sort(({ chainId: a }, { chainId: b }) => {
  //       const order = chainIdOrder;

  //       if (order.indexOf(b) === -1) return -1;
  //       if (order.indexOf(b) === -1 && order.indexOf(a) === -1) return 0;
  //       if (order.indexOf(a) === -1) return 1;
  //       return order.indexOf(b) - order.indexOf(a);
  //     })
  //     .map(
  //       t =>
  //         ({
  //           type: "tokenChain",
  //           value: { ...t, chain: chains?.find(c => c.id === t.chainId) },
  //         }) satisfies TagType<"tokenChain">,
  //     );
  // }, [tokens, chains]);

  return (
    <Hero
      breadcrumbs={[
        { link: "/tokens", name: "Tokens" },
        { link: `/tokens/${tokens?.[0]?.symbol}`, name: tokens?.[0]?.symbol },
      ]}
      icons={[{ src: tokens.find(t => t.icon && t.icon !== "")?.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <>
          {token.name} <span className="font-mono text-main-8">({token.symbol})</span>
        </>
      }
      description={`Earn rewards by using ${token.symbol} as liquidity, or directly earn ${token.symbol} as rewards`}
      sideDatas={defaultHeroSideDatas(count, maxApr, Number.parseFloat(dailyRewards))}
      tags={tags.map(tag => <Tag key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="lg" />)}>
      <Outlet />
    </Hero>
  );
}
