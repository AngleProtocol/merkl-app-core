import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Icon, Text, Title } from "dappkit";
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

  const rows = useMemo(() => {
    if (!opportunity?.campaigns) return null;
    const now = moment().unix();
    const shownCampaigns = opportunity.campaigns.filter(c => showInactive || Number(c.endTimestamp) > now);
    const startsOpen = shownCampaigns.length < 3;

    const campaignsSorted = shownCampaigns.sort((a, b) => Number(b.endTimestamp) - Number(a.endTimestamp));
    return campaignsSorted?.map(c => (
      <CampaignTableRow key={c.id} campaign={c} opportunity={opportunity} startsOpen={startsOpen} chain={chain} />
    ));
  }, [opportunity, showInactive, chain]);

  return (
    <CampaignTable
      className="w-full"
      dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
      hideLabels={!rows?.length}
      header={
        <Group className="justify-between items-center w-full">
          <Title className="!text-main-11" h={5}>
            Campaigns
          </Title>
          <Group>
            <Button onClick={() => setShowInactive(r => !r)} look="soft">
              <Icon remix={showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} Inactive
            </Button>
          </Group>
        </Group>
      }>
      {!!rows?.length ? (
        rows
      ) : (
        <Box look="base" className="py-xl*2 flex-col text-center">
          <Text>No active campaign</Text>
          <div className="w-full">
            <Button onClick={() => setShowInactive(r => !r)} look="soft" className="m-auto">
              <Icon remix={showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} Inactive
            </Button>
          </div>
        </Box>
      )}
    </CampaignTable>
  );
}
