import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Divider, Group, Hash, Icon, PrimitiveTag, Text, Value } from "dappkit";
import { useMemo } from "react";

type AprSectionProps = {
  opportunity: Opportunity;
};

export default function AprSection({ opportunity }: AprSectionProps) {
  const breakdowns = useMemo(() => {
    return opportunity.aprRecord?.breakdowns.filter(aprBreakdown => aprBreakdown.type !== "PROTOCOL");
  }, [opportunity]);

  const aprFormat = useMerklConfig(store => store.config.decimalFormat.apr);

  const getAprName = (breakdown: Opportunity["aprRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Text className="flex items-center gap-sm" size="sm">
            <span>Campaign</span>
            <Hash format="prefix" copy>
              {breakdown.identifier}
            </Hash>
          </Text>
        );
      case "PROTOCOL":
        return (
          <Text className="flex items-center gap-sm" size="sm">
            {breakdown.identifier.split(" ")[0]}
            <Hash format="prefix" copy>
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Text>
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
      <Text bold className="flex items-center gap-xs " size="sm" look="bold">
        <Icon remix="RiFileList3Line" />
        APR details
      </Text>

      <Divider />
      <Group className="flex-col">
        {breakdowns?.map(breakdown => (
          <Group key={breakdown.id} className="items-center justify-between" size="sm">
            <Text size="sm" look="bold">
              {getAprName(breakdown)}
            </Text>
            <PrimitiveTag look="bold" size="sm">
              <Value value format={aprFormat}>
                {breakdown.value / 100}
              </Value>
            </PrimitiveTag>
          </Group>
        ))}
      </Group>
    </Group>
  );
}
