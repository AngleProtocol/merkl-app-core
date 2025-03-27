import { api } from "@core/api";
import CustomBanner from "@core/components/element/CustomBanner";
import { ErrorContent } from "@core/components/layout/ErrorContent";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Show, Space, Title } from "dappkit";

export async function loader({ context: { backend }, request }: LoaderFunctionArgs) {
  // --- Default sortering
  const url = new URL(request.url);
  const hasSearchParams = url.searchParams.size > 0;
  if (!hasSearchParams) url.searchParams.set("status", backend.opportunityDefaultStatus.join(","));
  const defaultRequest = { ...request, url: url.toString() };
  // ---

  const opportunityService = OpportunityService({ api, backend, request: defaultRequest });

  const { opportunities, count } = await opportunityService.getManyFromRequest();
  const { opportunities: featuredOpportunities } = await opportunityService.getFeatured();

  //TODO: embed this in client/service
  const chains = await ChainService({ api }).getAll();
  const { protocols } = await ProtocolService({ api, backend, request }).getManyFromRequest();

  return { opportunities, chains, count, protocols, featuredOpportunities };
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, protocols, featuredOpportunities } = useLoaderData<typeof loader>();
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
        <OpportunityLibrary opportunities={opportunities} chains={chains} count={count} protocols={protocols} />
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
