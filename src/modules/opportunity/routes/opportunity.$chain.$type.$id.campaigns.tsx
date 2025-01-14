import { useOutletContext } from "@remix-run/react";
import { Container, Group, Space } from "dappkit";
import CampaignLibrary from "../../../components/element/campaign/CampaignLibrary";
import { ErrorContent } from "../../../components/layout/ErrorContent";
import type { OutletContextOpportunity } from "./_merkl.opportunities.$chain.$type.$id";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <Group>
        <CampaignLibrary opportunity={opportunity} chain={chain} />

        {/* {merklConfig.deposit && (
          <Group className="flex-col">
            <Box className="w-full">
              <Participate displayMode={"deposit"} opportunity={opportunity} />
            </Box>
          </Group>
        )} */}
      </Group>
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
