import type { Opportunity } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Group } from "dappkit";
import { I18n } from "../../../I18n";
import Hero, { defaultHeroSideDatas } from "../../../components/composite/Hero";
import { Cache } from "../../../modules/cache/cache.service";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

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

  return json({
    opportunities,
    count,
    protocol,
    liveOpportunityCount: liveCount,
    maxApr: opportunitiesByApr?.[0]?.apr,
    dailyRewards: sum,
  });
}

export const clientLoader = Cache.wrap("protocol", 300);

export type OutletContextProtocol = {
  opportunities: Opportunity[];
  count: number;
};

export default function Index() {
  const { opportunities, count, protocol, liveOpportunityCount, maxApr, dailyRewards } = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ src: protocol?.icon }]}
      title={<Group className="items-center">{protocol?.name}</Group>}
      breadcrumbs={[
        { link: "/protocols", name: "Protocols" },
        { link: `/protocols/${protocol?.id}`, name: protocol?.name },
      ]}
      description={
        (protocol?.description !== "" && protocol?.description) ||
        `Earn rewards by supplying liquidity on ${protocol?.name}`
      }
      sideDatas={defaultHeroSideDatas(liveOpportunityCount, maxApr, Number.parseFloat(dailyRewards))}>
      <Outlet context={{ opportunities, count }} />
    </Hero>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.protocol) return [{ title: I18n.trad.get.pages.protocols.headTitle }];

  return [{ title: `${data?.protocol?.name}` }];
};
