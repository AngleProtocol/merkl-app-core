import { api } from "@core/api";
import { ErrorContent } from "@core/components/layout/ErrorContent";
import { ChainService } from "@core/modules/chain/chain.service";
import { InteractionService } from "@core/modules/interaction/interaction.service";
import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useOutletContext } from "react-router";
import { Container, Group, Text } from "dappkit";
import OpportunityBoxParticipate from "../components/element/OpportunityBoxParticipate";
import { OpportunityService } from "../opportunity.service";

export async function loader({
  context: { backend },
  params: { id, type, chain: chainId },
  request,
}: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService({ api }).get({ name: chainId });
  const opportunity = (await OpportunityService({ api, request, backend }).getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  })) as unknown as Opportunity;

  const targets = await InteractionService({ api, backend }).getTargetsByOpportunity(opportunity as Opportunity);

  return {
    targets,
  };
}

export default function Index() {
  const { targets } = useLoaderData<typeof loader>();
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Group className="flex-wrap lg:flex-nowrap lg:flex-row gap-xl py-xl">
        <OpportunityBoxParticipate {...{ opportunity, targets }} className="w-full lg:min-w-[24ch] lg:max-w-sm " />
        <Group className="flex flex-col items-start gap-xl">
          <Text className="h-[fit-content] border-1 rounded-xl+md border-main-5 p-xl">
            Each opportunity can have multiple campaigns, with different reward rules. Some reward bigger deposits,
            others longer participation or specific tokens. Check campaigns details to find the best way to maximize
            your rewards!
          </Text>
          <Outlet context={{ opportunity, chain }} />
        </Group>
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
