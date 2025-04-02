import { api } from "@core/api";
import { ErrorContent } from "@core/components/layout/ErrorContent";
import { ChainService } from "@core/modules/chain/chain.service";
import { InteractionService } from "@core/modules/interaction/interaction.service";
import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Opportunity } from "@merkl/api";
import\b.*react-router";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Container, Group } from "dappkit";
import OpportunityBoxParticipate from "../components/element/OpportunityBoxParticipate";
import { OpportunityService } from "../opportunity.service";

export async function loader({
  context: { backend },
  params: { id, type, chain: chainId },
  request,
}: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService({ api, request, backend }).get({ name: chainId });
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
      <Group className="flex-col flex-wrap-reverse lg:flex-nowrap lg:flex-row-reverse gap-xl py-xl">
        <OpportunityBoxParticipate {...{ opportunity, targets }} className="w-full lg:min-w-[24ch] lg:max-w-sm " />
        <Group className="flex grow flex-col items-start gap-xl max-w-[100%]">
          <Outlet context={{ opportunity, chain }} />
        </Group>
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
