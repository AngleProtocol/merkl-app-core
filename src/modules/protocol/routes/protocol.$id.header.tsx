import { api } from "@core/api";
import Hero, { defaultHeroSideDatas } from "@core/components/composite/Hero";
import { Cache } from "@core/modules/cache/cache.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import useProtocolMetadata from "@core/modules/protocol/hooks/useProtocolMetadata";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { Group } from "dappkit";

export async function loader({ context: { backend, routes }, params: { id }, request }: LoaderFunctionArgs) {
  if (!id) throw new Error("Protocol not found");
  const protocol = await ProtocolService({ api }).getById(id);
  const opportunityService = OpportunityService({ api, request, backend });

  const { opportunities, count } = await opportunityService.getManyFromRequest({ mainProtocolId: id });

  const { opportunities: opportunitiesByApr, count: liveCount } = await opportunityService.getMany({
    mainProtocolId: id,
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum } = await opportunityService.getAggregate({ mainProtocolId: id }, "dailyRewards");

  return {
    opportunities,
    count,
    protocol,
    liveOpportunityCount: liveCount,
    maxApr: opportunitiesByApr?.[0]?.apr,
    dailyRewards: sum,
    backend,
    routes,
    ...MetadataService({ backend, routes, request }).fill(),
  };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export const clientLoader = Cache.wrap("protocol", 300);

export type OutletContextProtocol = {
  opportunities: Opportunity[];
  count: number;
};

export default function Index() {
  const { opportunities, count, protocol, liveOpportunityCount, maxApr, dailyRewards } = useLoaderData<typeof loader>();
  const { icon, name, description, link } = useProtocolMetadata(protocol);

  return (
    <Hero
      icons={[{ src: icon }]}
      title={<Group className="items-center">{name}</Group>}
      breadcrumbs={[
        { link: "/protocols", name: "Protocols" },
        { link, name },
      ]}
      description={description}
      sideDatas={defaultHeroSideDatas(liveOpportunityCount, maxApr, Number.parseFloat(dailyRewards))}>
      <Outlet context={{ opportunities, count }} />
    </Hero>
  );
}
