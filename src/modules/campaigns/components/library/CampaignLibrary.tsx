import type { OutletContextOpportunity } from "@core/modules/opportunity/routes/opportunity.$chain.$type.$id.header";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Button, Divider, Group, Icon, OverrideTheme, Text, Tooltip } from "dappkit";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router";
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

  const navigateToMerklStatusPage = useCallback(() => {
    window.open("https://beta.merkl.xyz/status", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <CampaignTable
      hideLabels={true}
      responsive
      dividerClassName={() => "bg-main-6"}
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
          {!!opportunity.howToSteps?.length && (
            <Group size="sm">
              <Text look="tint" size="md" bold>
                How to?
              </Text>
              <Tooltip
                helper={
                  <Group>
                    <Group size={"sm"}>
                      <Icon remix="RiMegaphoneFill" className="text-main-11" />
                      <Text bold look="tint">
                        Step to earn rewards
                      </Text>
                    </Group>
                    <Divider />
                    <Text className="inline" size={"sm"}>
                      <ul className="list-decimal ml-lg space-y-2">
                        {opportunity.howToSteps.map(step => (
                          <li key={step}>{step}</li>
                        ))}
                        <li>
                          Claim
                          <Link to="/users"> rewards</Link> anytime via Merkl (updated every 3-12 hours).{" "}
                          <Text className="cursor-pointer" look="tint" onClick={navigateToMerklStatusPage} size={"sm"}>
                            Check next reward update
                          </Text>
                        </li>
                      </ul>
                    </Text>
                  </Group>
                }
                className="p-xl"
              />
            </Group>
          )}
        </Group>
      }>
      {rows}
    </CampaignTable>
  );
}
