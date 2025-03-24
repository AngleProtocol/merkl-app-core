import { api } from "@core/api";
import Hero, { defaultHeroSideDatas } from "@core/components/composite/Hero";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";

export async function loader({ context: { backend, routes }, params: { id }, request }: LoaderFunctionArgs) {
  const chain = await ChainService({ api }).get({ name: id });
  const opportunityService = OpportunityService({ api, request, backend });

  const { opportunities: opportunitiesByApr, count } = await opportunityService.getMany({
    chainId: chain.id.toString(),
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum: dailyRewards } = await opportunityService.getAggregate({ chainId: chain.id.toString() }, "dailyRewards");

  return {
    chain,
    count,
    dailyRewards,
    maxApr: opportunitiesByApr?.[0]?.apr,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export const clientLoader = Cache.wrap("chain", 300);

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { chain, count, dailyRewards, maxApr } = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ src: chain.icon }]}
      breadcrumbs={[
        { link: "/chains", name: "Chains" },
        { link: "/", name: chain.name },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={chain.name}
      description={`Earn rewards by supplying liquidity on ${chain.name}`}
      sideDatas={defaultHeroSideDatas(count, maxApr, Number.parseFloat(dailyRewards))}>
      <Outlet />
    </Hero>
  );
}
