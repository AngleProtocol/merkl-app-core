import { api } from "@core/api";
import Hero from "@core/components/composite/Hero";
import { useMerklConfig } from "@core/index.generated";
import { Cache } from "@core/modules/cache/cache.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import MetricBox from "@core/modules/opportunity/components/element/MetricBox";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import useProtocolMetadata from "@core/modules/protocol/hooks/useProtocolMetadata";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { Opportunity } from "@merkl/api";
import { Button, Container, Group, Icon, Value } from "dappkit";
import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

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
  const { opportunities, count, protocol, maxApr, dailyRewards } = useLoaderData<typeof loader>();
  const { icon, name, description } = useProtocolMetadata(protocol);
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const { track } = useMixpanelTracking();

  return (
    <Hero
      icons={[{ src: icon }]}
      title={
        <Group className="items-center">
          {name}
          <Button
            external
            to={protocol.url}
            look="base"
            onLink={() => track("Click on button", { button: "protocol_url", type: protocol.url })}>
            <Icon remix="RiShareBoxLine" />
          </Button>
        </Group>
      }
      description={description}>
      <Container>
        <Group className="w-full mt-xl*2 mb-xl" size="xl">
          <MetricBox
            label="Opportunities"
            value={
              <Value format="0" size={4} className="text-main-12">
                {count}
              </Value>
            }
          />
          <MetricBox
            label="Daily rewards"
            value={
              <Value format={dollarFormat} size={4} className="text-main-12">
                {dailyRewards}
              </Value>
            }
          />
          <MetricBox
            label="Max APR"
            value={
              <Value format="0a%" size={4} className="!text-main-12">
                {maxApr / 100}
              </Value>
            }
          />
        </Group>
      </Container>
      <Outlet context={{ opportunities, count }} />
    </Hero>
  );
}
