import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { useOutletContext } from "@remix-run/react";
import { Button, Divider, Group, Icon, OverrideTheme, Text, Tooltip } from "dappkit";
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
            <Group size="xs">
              {hasOnlyInactiveCampaigns ? (
                <Text bold look="soft">
                  NO ACTIVE CAMPAIGN
                </Text>
              ) : (
                <Text bold look="soft">
                  {nbActiveCampaigns} {(nbActiveCampaigns ?? 0) > 1 ? "ACTIVE CAMPAIGNS" : "LIVE CAMPAIGN"}
                </Text>
              )}
              <Tooltip
                className="w-[286px] p-xl"
                helper={
                  <Group>
                    <Group size={"sm"}>
                      <Icon remix="RiMegaphoneFill" className="text-main-11" />
                      <Text bold look="tint">
                        Campaigns
                      </Text>
                    </Group>
                    <Divider />
                    <Text look="soft" size={"sm"}>
                      You can earn rewards from multiple campaigns that incentivize the same asset. Check the rules and
                      eligibility criteria.
                    </Text>
                    <Button look="soft" size="xs" className="text-accent-11">
                      <Icon remix="RiArrowRightLine" />
                      More on Docs
                    </Button>
                  </Group>
                }
              />
            </Group>
          </OverrideTheme>
        </Group>
      }>
      {rows}
    </CampaignTable>
  );
}
