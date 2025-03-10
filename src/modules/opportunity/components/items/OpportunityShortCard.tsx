import merklConfig from "@core/config";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Space, Text, Value } from "dappkit";

export type OpportunityShortCardProps = { opportunity: Opportunity; displayLinks?: boolean };

export default function OpportunityShortCard({ opportunity, displayLinks }: OpportunityShortCardProps) {
  const { name, url, Icons, link } = useOpportunityData(opportunity);

  return (
    <Group className="flex-col">
      <Button look="soft" to={link} className="text-xl flex-nowrap">
        <Icons />
        <Text look="bold" bold>
          {name}
        </Text>
      </Button>
      <Space size="xl" />
      <Group className="justify-between">
        <Group className="flex-col">
          <Text look="bold" className="flex items-center">
            <Value value format={merklConfig.decimalFormat.apr}>
              {opportunity.apr ?? 0}
            </Value>{" "}
            APR
          </Text>
          <Text look="bold" className="flex items-center">
            <Value value format={merklConfig.decimalFormat.dollar}>
              {opportunity.tvl ?? 0}
            </Value>{" "}
            TVL
          </Text>
          <Text look="bold" className="flex items-center">
            <Value value format={merklConfig.decimalFormat.dollar}>
              {opportunity.dailyRewards ?? 0}
            </Value>{" "}
            Daily Rewards
          </Text>
        </Group>
        <Group className="flex-col justify-end">
          {displayLinks && !!url && (
            <Button external to={url} disabled={!url} look="base">
              {opportunity.protocol?.icon && <Icon src={opportunity.protocol?.icon} />}
              {opportunity.protocol?.name ? opportunity.protocol.name : "the protocol"}
              <Icon remix="RiArrowRightUpLine" />
            </Button>
          )}
        </Group>
      </Group>
    </Group>
  );
}
