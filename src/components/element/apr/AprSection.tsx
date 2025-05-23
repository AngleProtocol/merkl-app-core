import type { Opportunity } from "@merkl/api";
import { Group, Hash, PrimitiveTag, Text } from "dappkit";
import AprValue from "./AprValue";

type AprSectionProps = {
  breakdowns: Opportunity["aprRecord"]["breakdowns"];
};

export default function AprSection({ breakdowns }: AprSectionProps) {
  const getAprName = (breakdown: Opportunity["aprRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Text className="flex items-center gap-sm" size="sm" look="bold">
            <span>Campaign</span>
            <Hash format="prefix" copy size={"sm"} look="bold">
              {breakdown.identifier}
            </Hash>
          </Text>
        );
      case "PROTOCOL":
        return (
          <Text className="flex items-center gap-sm" size="sm">
            {breakdown.identifier.split(" ")[0]}
            <Hash format="prefix" copy size={"sm"}>
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Text>
        );
      case "TOKEN":
        return breakdown.identifier;
      default:
        return (
          <Hash format="prefix" size="sm" copy>
            {breakdown.identifier}
          </Hash>
        );
    }
  };

  if (!breakdowns?.length) return null;

  return (
    <Group className="flex-col" size="sm">
      <Group className="flex-col" size="sm">
        {breakdowns?.map(breakdown => (
          <Group key={breakdown.identifier} className="items-center justify-between" size="sm">
            <Text size="sm" look="bold">
              {getAprName(breakdown)}
            </Text>
            <PrimitiveTag look="bold" size="sm">
              <AprValue value>{breakdown.value}</AprValue>
            </PrimitiveTag>
          </Group>
        ))}
      </Group>
    </Group>
  );
}
