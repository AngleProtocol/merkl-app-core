import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Title } from "dappkit";
import OpportunityLibrary from "../../../components/element/opportunity/OpportunityLibrary";
import merklConfig from "../../../config";
import { Cache } from "../../../modules/cache/cache.service";
import { ChainService } from "../../../modules/chain/chain.service";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";

export async function loader({ params: { symbol }, request }: LoaderFunctionArgs) {
  const opportunityFilters = { tokens: symbol } as const;

  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, opportunityFilters);
  const { opportunities: featuredOpportunities } = await OpportunityService.getFeatured(request, opportunityFilters);

  //TODO: embed this in client/service
  const chains = await ChainService.getAll();

  return { opportunities, chains, count, featuredOpportunities };
}

export const clientLoader = Cache.wrap("token/opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, featuredOpportunities } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <Group size="xl" className="py-xl flex-col">
        {merklConfig.opportunity.featured.enabled && (
          <>
            <Title className="!text-main-11" h={3}>
              BEST OPPORTUNITIES
            </Title>
            <OpportunityLibrary forceView={"cells"} hideFilters opportunities={featuredOpportunities} />
            <Space size="xl" />
            <Title className="!text-main-11" h={3}>
              ALL OPPORTUNITIES
            </Title>
          </>
        )}
        <OpportunityLibrary exclude={["protocol"]} opportunities={opportunities} count={count} chains={chains} />
      </Group>
    </Container>
  );
}
