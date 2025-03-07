import { ErrorContent } from "@core/components/layout/ErrorContent";
import CampaignLibrary from "@core/modules/campaigns/components/library/CampaignLibrary";
import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import { useOutletContext } from "@remix-run/react";
import { Container, Group, Space, Text } from "dappkit";
import OpportunityBoxParticipate from "../components/element/OpportunityBoxParticipate";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <Group className="flex-nowrap">
        <OpportunityBoxParticipate opportunity={opportunity} />
        <Group>
          <Text>
            Each opportunity can have multiple campaigns, with different reward rules. Some reward bigger deposits,
            others longer participation or specific tokens. Check campaigns details to find the best way to maximize
            your rewards!
          </Text>
          <CampaignLibrary opportunity={opportunity} chain={chain} />
        </Group>
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
