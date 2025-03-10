import { api } from "@core/api";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Title } from "dappkit";

export async function loader({ context: { backend }, params: { symbol }, request }: LoaderFunctionArgs) {
  const opportunityFilters = { tokens: symbol } as const;
  const opportunityService = OpportunityService({ api, request, backend });

  const { opportunities, count } = await opportunityService.getManyFromRequest(opportunityFilters);
  const { opportunities: featuredOpportunities } = await opportunityService.getFeatured(opportunityFilters);

  //TODO: embed this in client/service
  const chains = await ChainService({ api }).getAll();

  return { opportunities, chains, count, featuredOpportunities };
}

export const clientLoader = Cache.wrap("token/opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, featuredOpportunities } = useLoaderData<typeof loader>();
  const areFeaturedOpportunitiesEnabled = useMerklConfig(store => store.config.opportunity.featured.enabled);

  return (
    <Container>
      <Space size="xl" />
      <Group size="xl" className="py-xl flex-col">
        {areFeaturedOpportunitiesEnabled && (
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
        <OpportunityLibrary exclude={["protocol"]} opportunities={opportunities} count={count} chains={chains} />
      </Group>
    </Container>
  );
}
