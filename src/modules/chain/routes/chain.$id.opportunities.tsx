import { api } from "@core/api";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Title } from "dappkit";

export async function loader({ context: { backend }, params: { id: chainId }, request }: LoaderFunctionArgs) {
  const chain = await ChainService({ api }).get({ name: chainId });
  const opportunityService = OpportunityService({ api, request, backend });
  const opportunityFilters = {
    chainId: chain.id.toString(),
  } as const;

  const { opportunities, count } = await opportunityService.getManyFromRequest(opportunityFilters);
  const { opportunities: featuredOpportunities } = await opportunityService.getFeatured(opportunityFilters);

  const { protocols } = await ProtocolService({ api, backend, request }).getManyFromRequest();

  return { opportunities, count, protocols, featuredOpportunities };
}

export const clientLoader = Cache.wrap("chain/opportunities", 300);

export default function Index() {
  const { opportunities, count, protocols, featuredOpportunities } = useLoaderData<typeof loader>();
  const areFeturedOpportunitiesEnabled = useMerklConfig(store => store.config.opportunity.featured.enabled);

  return (
    <Container>
      <Space size="xl" />
      <Group size="xl" className="py-xl flex-col">
        {areFeturedOpportunitiesEnabled && (
          <>
            <Title look="soft" h={3}>
              BEST OPPORTUNITIES
            </Title>
            <OpportunityLibrary forceView={"cells"} hideFilters opportunities={featuredOpportunities} />
            <Space size="xl" />
            <Title look="soft" h={3}>
              ALL OPPORTUNITIES
            </Title>
          </>
        )}
        <OpportunityLibrary exclude={["chain"]} opportunities={opportunities} count={count} protocols={protocols} />
      </Group>
    </Container>
  );
}
