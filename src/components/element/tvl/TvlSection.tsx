import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, PrimitiveTag, Text, Value } from "dappkit";
import { Fragment, useMemo, useState } from "react";

interface TvlSectionProps {
  opportunity: Opportunity;
}

const DEFAULT_ARRAY_SIZE = 3;

export default function TvlSection({ opportunity }: TvlSectionProps) {
  const [isShowingMore, setIsShowingMore] = useState(false);
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const aprFormat = useMerklConfig(store => store.config.decimalFormat.apr);

  const tvlFiltered = useMemo(() => {
    return opportunity.tvlRecord?.breakdowns
      ?.filter(breakdown => breakdown.type === "PROTOCOL")
      ?.sort((a, b) => b.value - a.value)
      ?.slice(0, isShowingMore ? opportunity.tvlRecord?.breakdowns?.length : 3);
  }, [opportunity, isShowingMore]);

  const aprFiltered = useMemo(() => {
    return opportunity.aprRecord?.breakdowns.filter(breakdown => breakdown?.type === "PROTOCOL");
  }, [opportunity]);

  const getTvlName = (breakdown: Opportunity["tvlRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "PROTOCOL":
        return (
          <Group className="items-center">
            <Text size={"sm"}>{breakdown.identifier.split(" ")[0]}</Text>
            <Hash format="prefix" copy size={"sm"}>
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Group>
        );
      default:
        return (
          <Hash format="prefix" copy size={"sm"}>
            {breakdown.identifier}
          </Hash>
        );
    }
  };

  const hasForwarders = tvlFiltered?.length > 0;

  return (
    <>
      <Group className="flex-col" size="sm">
        {hasForwarders && (
          <>
            <Group
              className="grid"
              style={{
                gridTemplateColumns: "minmax(350px, 1fr) minmax(min-content, 100px) minmax(min-content, 100px)",
              }}>
              <Text bold className="flex items-center gap-xs " size="sm" look="bold">
                <Icon remix="RiForwardEndFill" />
                Forwarder details
              </Text>

              <Text bold size="sm" className="inline-flex justify-end" look="bold">
                APR
              </Text>
              <Text bold size="sm" className="inline-flex justify-end" look="bold">
                TVL
              </Text>
            </Group>
            <Divider />
          </>
        )}
        <Group className="flex-col" size="sm">
          {tvlFiltered?.map(breakdown => {
            const aprBreakdown = aprFiltered.find(b => b.identifier === breakdown.identifier);
            return (
              <Fragment key={breakdown.id}>
                <Group
                  className="grid"
                  style={{
                    gridTemplateColumns: "minmax(350px, 1fr) minmax(min-content, 100px) minmax(min-content, 100px)",
                  }}
                  size="md">
                  <Text size="sm" look="bold">
                    {getTvlName(breakdown)}
                  </Text>

                  {aprBreakdown && (
                    <PrimitiveTag className="w-fit ml-auto" look="bold" size="sm">
                      <Value value format={aprFormat}>
                        {aprBreakdown.value / 100}
                      </Value>
                    </PrimitiveTag>
                  )}
                  <Text look="bold" className="inline-flex justify-end" size="sm">
                    <Value value format={dollarFormat}>
                      {breakdown.value}
                    </Value>
                  </Text>
                </Group>
              </Fragment>
            );
          })}
        </Group>
      </Group>
      {tvlFiltered?.length >= DEFAULT_ARRAY_SIZE && (
        <>
          <Divider look="soft" />
          <Button size="sm" className="mx-auto my-sm" look="soft" onClick={() => setIsShowingMore(!isShowingMore)}>
            Show {isShowingMore ? "Less" : "More"}
            <Icon remix={isShowingMore ? "RiArrowUpLine" : "RiArrowDownLine"} />
          </Button>
        </>
      )}
    </>
  );
}
