import { ErrorContent } from "@core/components/layout/ErrorContent";
import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import { Outlet, useOutletContext } from "@remix-run/react";
import { Container, Group, Text } from "dappkit";
import OpportunityBoxParticipate from "../components/element/OpportunityBoxParticipate";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Group className="flex-wrap flex-col-reverse lg:flex-nowrap lg:flex-row gap-xl py-xl">
        <OpportunityBoxParticipate opportunity={opportunity} className="max-w-sm min-w-[24ch]" />
        <Group className="flex flex-col items-start gap-xl">
          <Text className="h-[fit-content]">
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
