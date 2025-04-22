import type { Campaign } from "@merkl/api";
import { Divider, Group, Icon, Text } from "dappkit";
import moment from "moment";

export type CampaignTooltipDatesProps = {
  campaign: Campaign;
};

export default function CampaignTooltipDates({ campaign }: CampaignTooltipDatesProps) {
  return (
    <>
      <Group>
        <Icon remix={"RiCalendar2Line"} />
        <Text look="bold">Campaign dates</Text>
        <Divider look="soft" horizontal />
        <Group className="flex-col">
          <Group>
            <Text size="sm" look={"bold"}>
              Start
            </Text>
            <Text size="sm">{moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY ha z")}</Text>
          </Group>
          <Group>
            <Text size="sm" look={"bold"}>
              End
            </Text>
            <Text size="sm">{moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY ha z")}</Text>
          </Group>
        </Group>
      </Group>
    </>
  );
}
