import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Container, Group, Space, Title } from "dappkit";
import { useWalletContext } from "dappkit";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

export async function loader({ context: { backend }, params: { id }, request }: LoaderFunctionArgs) {
  const opportunityFilters = { mainProtocolId: id } as const;
  const opportunityService = OpportunityService({ api, request, backend });

  const { opportunities, count } = await opportunityService.getManyFromRequest(opportunityFilters);
  const { opportunities: featuredOpportunities } = await opportunityService.getFeatured(opportunityFilters);
  const { protocols } = await ProtocolService({ backend, api, request }).getManyFromRequest();

  return { opportunities, count, protocols, featuredOpportunities };
}

export default function Index() {
  const { chains } = useWalletContext();
  const { opportunities, count, featuredOpportunities } = useLoaderData<typeof loader>();
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
