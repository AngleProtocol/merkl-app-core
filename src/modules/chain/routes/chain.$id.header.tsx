import Hero, { defaultHeroSideDatas } from "@core/components/composite/Hero";
import { ChainService } from "@core/modules/chain/chain.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ params: { id }, request }: LoaderFunctionArgs) {
  const chain = await ChainService.get({ name: id });

  const { opportunities: opportunitiesByApr, count } = await OpportunityService.getMany({
    chainId: chain.id.toString(),
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum: dailyRewards } = await OpportunityService.getAggregate({ chainId: chain.id.toString() }, "dailyRewards");

  return withUrl(request, {
    chain,
    count,
    dailyRewards,
    maxApr: opportunitiesByApr?.[0]?.apr,
  });
}

// export const clientLoader = Cache.wrap("chain", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrap(data?.url, location.pathname, "chain", data?.chain);
};

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
