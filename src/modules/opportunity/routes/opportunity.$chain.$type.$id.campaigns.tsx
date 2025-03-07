import { ErrorContent } from "@core/components/layout/ErrorContent";
import CampaignLibrary from "@core/modules/campaigns/components/library/CampaignLibrary";
import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import { useOutletContext } from "@remix-run/react";
import { Container, Group, Space } from "dappkit";
import OpportunityBoxParticipate from "../components/element/OpportunityBoxParticipate";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <Group className="flex-nowrap">
        <OpportunityBoxParticipate opportunity={opportunity} />
        <CampaignLibrary opportunity={opportunity} chain={chain} />
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
