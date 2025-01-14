import type { Opportunity } from "@merkl/api";
import { Button, Group, Hash, Value } from "dappkit";
import { useMemo } from "react";
import { TvlRow } from "./TvlTable";

type TvlTableRowProps = {
  aprBreakdown?: Opportunity["aprRecord"]["breakdowns"][number];
  tvlBreakdown: Opportunity["tvlRecord"]["breakdowns"][number];
};

export default function TvlTableRow({ aprBreakdown, tvlBreakdown }: TvlTableRowProps) {
  const breakdownName = useMemo(() => {
    switch (aprBreakdown?.type) {
      case "CAMPAIGN":
        return (
          <Group>
            Campaign{" "}
            <Hash format="short" copy>
              {aprBreakdown?.identifier}
            </Hash>
          </Group>
        );
      case "PROTOCOL":
        return (
          <Group>
            {aprBreakdown?.identifier.split(" ")[0]}
            <Hash format="short" copy>
              {aprBreakdown?.identifier.split(" ")[1]}
            </Hash>
          </Group>
        );
      case "TOKEN":
        return aprBreakdown?.identifier;
      default:
        return (
          <Hash format="short" copy>
            {aprBreakdown?.identifier}
          </Hash>
        );
    }
  }, [aprBreakdown]);

  return (
    <TvlRow
      className={"!rounded-0"}
      nameColumn={breakdownName}
      aprColumn={
        <Button>
          <Value value format="0a%">
            {(aprBreakdown?.value ?? 0) / 100}
          </Value>
        </Button>
      }
      tvlColumn={
        <Value value format="0.00a">
          {tvlBreakdown?.value}
        </Value>
      }
    />
  );
}
