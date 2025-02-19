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

  const getAprName = (breakdown: Opportunity["aprRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Group className="items-center">
            Campaign
            <PrimitiveTag look="soft" size="xs">
              <Hash size="xs" format="short" copy className="text-accent-12">
                {breakdown.identifier}
              </Hash>
            </PrimitiveTag>
          </Group>
        );
      case "PROTOCOL":
        return (
          <Group>
            {breakdown.identifier.split(" ")[0]}
            <Hash format="short" copy size="xs">
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Group>
        );
      case "TOKEN":
        return breakdown.identifier;
      default:
        return (
          <Hash format="short" size="xs" copy>
            {breakdown.identifier}
          </Hash>
        );
    }
  };

  if (!breakdowns?.length) return null;

  return (
    <Group className="flex-col mt-md">
      <Group className="items-center" size="sm">
        <Icon className="text-accent-11" remix="RiFileList3Line" />
        <Text size="sm" bold>
          APR details
        </Text>
      </Group>

      <Divider />
      <Group className="flex-col">
        {breakdowns?.map(breakdown => (
          <Group key={breakdown.id} className="items-center justify-between" size="sm">
            <Text size="sm" look="bold">
              {getAprName(breakdown)}
            </Text>
            <PrimitiveTag noClick look="bold" size="sm">
              <Value value format="0a%">
                {breakdown.value / 100}
              </Value>
            </PrimitiveTag>
          </Group>
        ))}
      </Group>
    </Group>
  );
}
