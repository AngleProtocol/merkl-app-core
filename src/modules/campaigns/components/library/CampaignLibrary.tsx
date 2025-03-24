import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { useOutletContext } from "@remix-run/react";
import { Button, Group, Icon, OverrideTheme, Text } from "dappkit";
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

  const hasSomeInactiveCampaigns = opportunity.campaigns.some(c => Number(c.endTimestamp) < moment().unix());
  const hasOnlyInactiveCampaigns = opportunity.campaigns.every(c => Number(c.endTimestamp) < moment().unix());

  return (
    <CampaignTable
      className="w-full"
      hideLabels={true}
      footer={
        hasSomeInactiveCampaigns && (
          <Group className="w-full justify-center">
            <Button onClick={() => setShowInactive(r => !r)} look="soft" className="text-accent-11">
              <Icon remix={!showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} inactive campaigns
            </Button>
          </Group>
        )
      }
      header={
        <Group className="justify-between items-center w-full">
          <OverrideTheme coloring={!hasOnlyInactiveCampaigns ? "good" : undefined}>
            {hasOnlyInactiveCampaigns ? (
              <Text bold look="soft">
                NO ACTIVE CAMPAIGN
              </Text>
            ) : (
              <Text bold look="soft">
                {nbActiveCampaigns} {(nbActiveCampaigns ?? 0) > 1 ? "ACTIVE CAMPAIGNS" : "LIVE CAMPAIGN"}
              </Text>
            )}
          </OverrideTheme>
        </Group>
      }>
      {rows}
    </CampaignTable>
  );
}
