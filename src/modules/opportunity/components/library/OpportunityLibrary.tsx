import type { Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Icon, List, Text, Title } from "dappkit";
import { useCallback, useMemo, useRef, useState } from "react";
import Pagination from "../../../../components/element/Pagination";
import merklConfig from "../../../../config";
import type { OpportunityView } from "../../../../config/opportunity";
import OpportunityFilters, { type OpportunityFilterProps } from "../OpportunityFilters";
import OpportunityCell from "../items/OpportunityCell";
import OpportunityTableRow from "../items/OpportunityTableRow";
import { OpportunityTable } from "./OpportunityTable";

export type Displays = "grid" | "list";

export type OpportunityLibrary = {
  opportunities: Opportunity[];
  count?: number;
  chains?: Chain[];
  hideFilters?: boolean;
  forceView?: OpportunityView;
} & OpportunityFilterProps;

export default function OpportunityLibrary({
  opportunities,
  count,
  only,
  exclude = [],
  chains,
  protocols,
  hideFilters,
  forceView,
}: OpportunityLibrary) {
  // Merge global and local exclusions
  const mergedExclusions = useMemo(() => {
    // Get global exclusions from config
    const globalExclusions = merklConfig?.opportunityLibrary.excludeFilters || [];
    // Combine global and local exclusions
    const combinedExclusions = [...globalExclusions, ...exclude];
    // Remove duplicates
    return Array.from(new Set(combinedExclusions));
  }, [exclude]);

  const [view, setView] = useState<OpportunityView>(forceView ?? merklConfig.opportunityLibrary.defaultView ?? "table");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleClearFilters = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  const display = useMemo(() => {
    switch (view) {
      case "table":
        return (
          <OpportunityTable
            responsive
            exclude={["tvl"]}
            opportunityHeader={
              <Title className="!text-main-11" h={5}>
                Opportunities
              </Title>
            }
            dividerClassName={index => (index < 2 ? "bg-accent-11" : "bg-main-8")}
            ctaHeader={
              (merklConfig.opportunityLibrary?.views == null || merklConfig.opportunityLibrary?.views?.length > 1) &&
              view && (
                <Group className="flex-nowrap" size="sm">
                  <Button
                    // className={"text-accent-11 !opacity-100"}
                    look="soft"
                    onClick={() => setView?.("cells")}>
                    <Icon remix="RiDashboardFill" />
                  </Button>
                  <Button
                    disabled={view === "table"}
                    className={view === "table" ? "text-accent-11 !opacity-100" : ""}
                    look="soft"
                    onClick={() => setView?.("table")}>
                    <Icon remix="RiSortDesc" />
                  </Button>
                </Group>
              )
            }
            footer={count !== undefined && <Pagination count={count} />}>
            {opportunities?.map(o => (
              <OpportunityTableRow
                hideTags={merklConfig.opportunityLibrary.cells?.hideTags}
                navigationMode={merklConfig.opportunityNavigationMode}
                key={`${o.chainId}_${o.type}_${o.identifier}`}
                opportunity={o}
              />
            ))}
          </OpportunityTable>
        );
      case "cells":
        return (
          <List dividerClassName={() => "bg-accent-11"}>
            <Box size="lg" className="!p-lg !rounded-lg+md">
              <Group className="justify-between">
                <Text size={5}>Opportunities</Text>
                {(merklConfig.opportunityLibrary?.views == null || merklConfig.opportunityLibrary?.views?.length > 1) &&
                  view && (
                    <Group className="flex-nowrap" size="sm">
                      <Button
                        className={"text-accent-11 !opacity-100"}
                        disabled
                        look="soft"
                        onClick={() => setView?.("cells")}>
                        <Icon remix="RiDashboardFill" />
                      </Button>
                      <Button look="soft" onClick={() => setView?.("table")}>
                        <Icon remix="RiSortDesc" />
                      </Button>
                    </Group>
                  )}
              </Group>
            </Box>
            <Box>
              <Group>
                <Group className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
                  {opportunities?.map(o => (
                    <OpportunityCell
                      navigationMode={merklConfig.opportunityNavigationMode}
                      hideTags={merklConfig.opportunityLibrary.cells?.hideTags}
                      key={`${o.chainId}_${o.type}_${o.identifier}`}
                      opportunity={o}
                    />
                  ))}
                </Group>
              </Group>
            </Box>
            {count !== undefined && (
              <Box content="sm" className="w-full">
                <Pagination count={count} />
              </Box>
            )}
          </List>
        );
    }
  }, [opportunities, view, count]);

  return (
    <div className="flex flex-col w-full">
      {!hideFilters && (
        <div className="overflow-x-visible -mx-[clamp(0.5rem,3vw,5rem)] lg:mx-0" ref={scrollContainerRef}>
          <div className="min-w-min max-w-full px-[clamp(0.5rem,3vw,5rem)] lg:px-0">
            <Box content="sm" className="mb-lg justify-between w-full">
              <OpportunityFilters
                {...{ only, chains, protocols, view, setView }}
                exclude={mergedExclusions}
                onClear={handleClearFilters}
              />
            </Box>
          </div>
        </div>
      )}
      {display}
    </div>
  );
}
