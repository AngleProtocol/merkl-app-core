import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Title } from "dappkit";
import CustomBanner from "src/components/element/CustomBanner";
import OpportunityLibrary from "../../../components/element/opportunity/OpportunityLibrary";
import { ErrorContent } from "../../../components/layout/ErrorContent";
import merklConfig from "../../../config";
import { Cache } from "../../../modules/cache/cache.service";
import { ChainService } from "../../../modules/chain/chain.service";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request);
  const { opportunities: featuredOpportunities } = await OpportunityService.getFeatured(request);

  //TODO: embed this in client/service
  const chains = await ChainService.getAll();
  const { protocols } = await ProtocolService.getManyFromRequest(request);

  return json({ opportunities, chains, count, protocols, featuredOpportunities });
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, protocols, featuredOpportunities } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <CustomBanner />
      <Group size="xl" className="py-xl">
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
        <OpportunityLibrary opportunities={opportunities} chains={chains} count={count} protocols={protocols} />
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
