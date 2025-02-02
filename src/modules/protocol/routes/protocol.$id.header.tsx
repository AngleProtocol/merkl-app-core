import { I18n } from "@core/I18n";
import Hero, { defaultHeroSideDatas } from "@core/components/composite/Hero";
import { Cache } from "@core/modules/cache/cache.service";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import useProtocolMetadata from "@core/modules/protocol/hooks/useProtocolMetadata";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Group } from "dappkit";

export async function loader({ params: { id }, request }: LoaderFunctionArgs) {
  if (!id) throw new Error("Protocol not found");
  const protocol = await ProtocolService.getById(id);

  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, { mainProtocolId: id });

  const { opportunities: opportunitiesByApr, count: liveCount } = await OpportunityService.getMany({
    mainProtocolId: id,
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum } = await OpportunityService.getAggregate({ mainProtocolId: id }, "dailyRewards");

  return {
    opportunities,
    count,
    protocol,
    liveOpportunityCount: liveCount,
    maxApr: opportunitiesByApr?.[0]?.apr,
    dailyRewards: sum,
  };
}

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.protocol) return [{ title: I18n.trad.get.pages.protocols.headTitle }];

  return [{ title: `${data?.protocol?.name}` }];
};
