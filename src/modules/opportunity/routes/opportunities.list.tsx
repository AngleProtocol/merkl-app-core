import { api } from "@core/api";
import type { MerklServerContext } from "@core/app/server/context";
import CustomBanner from "@core/components/element/CustomBanner";
import { ErrorContent } from "@core/components/layout/ErrorContent";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { Container, Group, Show, Space, Title } from "dappkit";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ context: { backend }, request }: LoaderFunctionArgs<MerklServerContext>) {
  const opportunityService = OpportunityService({ api, backend, request });
  const { opportunities, count } = await opportunityService.getManyFromRequest();
  const { opportunities: featuredOpportunities } = await opportunityService.getFeatured();

  //TODO: embed this in client/service
  const chains = await ChainService({ api, request, backend }).getAll();

  return { opportunities, chains, count, featuredOpportunities };
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, featuredOpportunities } = useLoaderData<typeof loader>();
  const areFeaturedOpportunitiesEnabled = useMerklConfig(store => store.config.opportunity.featured.enabled);

  return (
    <Container>
      <CustomBanner />
      <Group size="xl" className="py-xl">
        <Show if={areFeaturedOpportunitiesEnabled}>
          <Title look="soft" h={3}>
            BEST OPPORTUNITIES
          </Title>
          <OpportunityLibrary forceView={"cells"} hideFilters opportunities={featuredOpportunities} />
          <Space size="xl" />
          <Title look="soft" h={3}>
            ALL OPPORTUNITIES
          </Title>
        </Show>
        <OpportunityLibrary opportunities={opportunities} chains={chains} count={count} />
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
