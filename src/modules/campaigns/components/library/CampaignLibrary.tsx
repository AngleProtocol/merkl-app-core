import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { useOutletContext } from "@remix-run/react";
import { Box, Button, Group, Icon, OverrideTheme, Text, Title } from "dappkit";
import moment from "moment";
import { useMemo, useState } from "react";
import CampaignTableRow from "../element/CampaignTableRow";
import { CampaignTable } from "./CampaignTable";

export type CampaignLibraryProps = {
  opportunity: Opportunity & { campaigns: Campaign[] };
  chain: Chain;
};

export default function CampaignLibrary({ opportunity, chain }: CampaignLibraryProps) {
  const [showInactive, setShowInactive] = useState(false);

  const { opportunity: opportunityOutlet, chain: chainOutlet } = useOutletContext<OutletContextOpportunity>();

  opportunity = opportunityOutlet || opportunity;
  chain = chainOutlet || chain;

  const rows = useMemo(() => {
    if (!opportunity?.campaigns) return null;
    const now = moment().unix();
    const shownCampaigns = opportunity.campaigns.filter(c => showInactive || Number(c.endTimestamp) > now);

    const campaignsSorted = shownCampaigns.sort((a, b) => Number(b.endTimestamp) - Number(a.endTimestamp));
    return campaignsSorted?.map((c, index) => (
      <CampaignTableRow key={c.id} campaign={c} opportunity={opportunity} startsOpen={index === 0} chain={chain} />
    ));
  }, [opportunity, showInactive, chain]);

  const nbActiveCampaigns = useMemo(() => {
    if (!opportunity?.campaigns) return null;
    const now = moment().unix();
    const shownCampaigns = opportunity.campaigns.filter(c => Number(c.endTimestamp) > now);
    return shownCampaigns.length;
  }, [opportunity]);

  return (
    <CampaignTable
      className="w-full"
      hideLabels={true}
      header={
        <Box className="bg-main-3">
          <Group className="justify-between items-center w-full">
            <OverrideTheme coloring={"good"}>
              <Title look="soft" h={5}>
                {nbActiveCampaigns} Active Campaigns
              </Title>
            </OverrideTheme>

            <Group>
              <Button onClick={() => setShowInactive(r => !r)} look="soft">
                <Icon remix={!showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
                {!showInactive ? "Show" : "Hide"} inactive campaigns
              </Button>
            </Group>
          </Group>
        </Box>
      }>
      {!!rows?.length ? (
        rows
      ) : (
        <Box look="base" className="py-xl*2 flex-col text-center">
          <Text>No active campaign</Text>
          <div className="w-full">
            <Button onClick={() => setShowInactive(r => !r)} look="soft" className="m-auto">
              <Icon remix={!showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} inactive campaigns
            </Button>
          </div>
        </Box>
      )}
    </CampaignTable>
  );
}
