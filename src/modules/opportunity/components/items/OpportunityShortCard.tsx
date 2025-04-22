import AprValue from "@core/components/element/apr/AprValue";
import { useMerklConfig } from "@core/modules/config/config.context";
import useOpportunityMetadata from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Space, Text, Value } from "dappkit";

export type OpportunityShortCardProps = { opportunity: Opportunity; displayLinks?: boolean };

export default function OpportunityShortCard({ opportunity, displayLinks }: OpportunityShortCardProps) {
  const { name, url, Icons, link } = useOpportunityMetadata(opportunity);

  const decimalFormat = useMerklConfig(store => store.config.decimalFormat);

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
            <AprValue value>{opportunity.apr}</AprValue> APR
          </Text>
          <Text look="bold" className="flex items-center">
            <Value value format={decimalFormat.dollar}>
              {opportunity.tvl ?? 0}
            </Value>{" "}
            TVL
          </Text>
          <Text look="bold" className="flex items-center">
            <Value value format={decimalFormat.dollar}>
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
