import { I18n } from "@core/I18n";
import { ErrorContent } from "@core/components/layout/ErrorContent";
import merklConfig from "@core/config";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Icon, Show, Space, Text, Title } from "dappkit";

export async function loader({ request }: LoaderFunctionArgs) {
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request);
  const { opportunities: featuredOpportunities } = await OpportunityService.getFeatured(request);

  //TODO: embed this in client/service
  const chains = await ChainService.getAll();
  const { protocols } = await ProtocolService.getManyFromRequest(request);

  return { opportunities, chains, count, protocols, featuredOpportunities };
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, protocols, featuredOpportunities } = useLoaderData<typeof loader>();

  return (
    <Container>
      {!!I18n.trad.get.pages.dashboard.explanation && (
        <>
          <Group className="rounded-md p-md bg-main-5 flex-nowrap items-start mt-xl">
            <Icon remix="RiInformation2Fill" className="text-lg text-accent-11 flex-shrink-0" />
            <Text look="bold" size="sm">
              {I18n.trad.get.pages.dashboard.explanation}
            </Text>
          </Group>
          <Space size="md" />
        </>
      )}
      <Group size="xl" className="py-xl">
        <Show if={merklConfig.opportunity.featured.enabled}>
          <Title className="!text-main-11" h={3}>
            BEST OPPORTUNITIES
          </Title>
          <OpportunityLibrary forceView={"cells"} hideFilters opportunities={featuredOpportunities} />
          <Space size="xl" />
          <Title className="!text-main-11" h={3}>
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
