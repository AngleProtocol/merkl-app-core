import { api } from "@core/api";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Hero, { defaultHeroSideDatas } from "../../../components/composite/Hero";
import { Cache } from "../../../modules/cache/cache.service";
import { TokenService } from "../../../modules/token/token.service";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { ChainService } from "@core/modules/chain/chain.service";
import type { Chain, Opportunity } from "@merkl/api";

export async function loader({ context: { backend, routes }, params: { symbol }, request }: LoaderFunctionArgs) {
  const tokens = await TokenService({ backend, api, request }).getSymbol(symbol);

  const chains = await ChainService({ api }).getAll();
  const opportunityService = OpportunityService({ api, backend, request });

  const { opportunities: opportunitiesByApr, count } = await opportunityService.getMany({
    rewardTokenSymbol: symbol,
    status: "LIVE",
  });

  return {
    tokens: tokens,
    chains,
    opportunities: opportunitiesByApr,
    count,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export const clientLoader = Cache.wrap("token", 300);

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export type OutletContextTokens = {
  opportunities: Opportunity[];
  chains: Chain[];
  count: number;
};

export default function Index() {
  const { tokens, count, opportunities, chains } = useLoaderData<typeof loader>();
  const token = tokens?.[0];

  return (
    <Hero
      breadcrumbs={[
        { link: "/tokens", name: "Tokens" },
        { link: `/tokens/${tokens?.[0]?.symbol}`, name: tokens?.[0]?.symbol },
      ]}
      icons={[{ src: tokens?.find(t => t.icon && t.icon !== "")?.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={token?.name ?? "Token not found"}
      description={
        token?.name
          ? `Earn rewards by using ${token?.symbol} as liquidity, or directly earn ${token?.symbol} as rewards`
          : ""
      }
      sideDatas={defaultHeroSideDatas(count)}>
      <Outlet context={{ opportunities, count, chains }} />
    </Hero>
  );
}
