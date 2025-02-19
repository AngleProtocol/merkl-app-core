import type { Opportunity } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, PrimitiveTag, Text, Value } from "dappkit";
import { Fragment, useMemo, useState } from "react";
import merklConfig from "../../../config";

interface TvlSectionProps {
  opportunity: Opportunity;
}

const DEFAULT_ARRAY_SIZE = 3;

export default function TvlSection({ opportunity }: TvlSectionProps) {
  const [isShowingMore, setIsShowingMore] = useState(false);

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
            <Text look="bold" size="sm">
              {breakdown.identifier.split(" ")[0]}
            </Text>
            <PrimitiveTag look="soft" size="xs">
              <Hash format="short" look="bold" copy size="xs">
                {breakdown.identifier.split(" ")[1]}
              </Hash>
            </PrimitiveTag>
          </Group>
        );
      default:
        return (
          <PrimitiveTag look="soft" size="xs">
            <Hash format="short" look="bold" copy>
              {breakdown.identifier}
            </Hash>
          </PrimitiveTag>
        );
    }
  };

  const hasForwarders = tvlFiltered?.length > 0;

  return (
    <>
      {hasForwarders && (
        <>
          <Group
            className="grid mt-md"
            style={{
              gridTemplateColumns: "minmax(350px, 1fr) minmax(min-content, 100px) minmax(min-content, 100px)",
            }}>
            <Group className="items-center" size="sm">
              <Icon className="text-main-11" remix="RiForwardEndFill" />
              <Text size="sm" bold>
                Forwarder details
              </Text>
            </Group>
            <Text size="sm" className="inline-flex justify-end">
              APR
            </Text>
            <Text size="sm" className="inline-flex justify-end">
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
                  <PrimitiveTag className="w-fit ml-auto" noClick look="bold" size="sm">
                    <Value value format="0a%">
                      {aprBreakdown.value / 100}
                    </Value>
                  </PrimitiveTag>
                )}
                <Text look="bold" className="inline-flex justify-end" size="sm">
                  <Value value format={merklConfig.decimalFormat.dollar}>
                    {breakdown.value}
                  </Value>
                </Text>
              </Group>
            </Fragment>
          );
        })}
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
