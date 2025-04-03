import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Divider, Group, Hash, Icon, Text, Value } from "dappkit";
import { useMemo } from "react";

type AprSectionProps = {
  opportunity: Opportunity;
};

export default function PointsModalCampaigns({ opportunity }: AprSectionProps) {
  const breakdowns = useMemo(() => {
    return opportunity.aprRecord?.breakdowns.filter(aprBreakdown => aprBreakdown.type !== "PROTOCOL");
  }, [opportunity]);

  const decimalFormatPoint = useMerklConfig(store => store.config.decimalFormat.point);

  const getAprName = (breakdown: Opportunity["aprRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Group className="items-center gap-sm">
            <Text size="xs">Campaign</Text>
            <Hash size="xs" format="prefix" copy>
              {breakdown.identifier}
            </Hash>
          </Group>
        );
      case "PROTOCOL":
        return (
          <Group>
            {breakdown.identifier.split(" ")[0]}
            <Hash format="prefix" copy size="xs">
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Group>
        );
      case "TOKEN":
        return breakdown.identifier;
      default:
        return (
          <Hash format="prefix" size="xs" copy>
            {breakdown.identifier}
          </Hash>
        );
    }
  };

  if (!breakdowns?.length) return null;

  return (
    <Group className="flex-col mt-md">
      <Text bold className="flex items-center gap-xs" size="sm" look="bold">
        <Icon remix="RiWaterFlashFill" />
        Score Breakdowns
      </Text>
      <Divider />
      <Group className="flex-col" size="sm">
        <Group className="items-center justify-between gap-xl" size="sm">
          <Text size="sm" look="soft">
            Average Score
          </Text>
          <Text look="soft" bold size="sm">
            <Value value format={decimalFormatPoint}>
              {opportunity.apr}
            </Value>
          </Text>
        </Group>
        {breakdowns?.map(breakdown => (
          <Group key={breakdown.id} className="items-center justify-between gap-xl" size="sm">
            <Text size="sm" look="soft">
              {getAprName(breakdown)}
            </Text>
            <Text look="soft" size="sm">
              <Value value format={decimalFormatPoint}>
                {breakdown.value}
              </Value>
            </Text>
          </Group>
        ))}
      </Group>
    </Group>
  );
}
