import type { Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Box, Group, type Order, Title } from "dappkit";
import { useCallback, useMemo, useRef, useState } from "react";
import Pagination from "../../../../components/element/Pagination";
import merklConfig from "../../../../config";
import type { OpportunityView } from "../../../../config/opportunity";
import useSearchParamState from "../../../../hooks/filtering/useSearchParamState";
import OpportunityFilters, { type OpportunityFilterProps } from "../OpportunityFilters";
import OpportunityCell from "../items/OpportunityCell";
import OpportunityTableRow from "../items/OpportunityTableRow";
import { OpportunityTable, type opportunityColumns } from "./OpportunityTable";

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
  const sortable = ["apr", "tvl", "rewards"] as const satisfies typeof opportunityColumns;

  // Merge global and local exclusions
  const mergedExclusions = useMemo(() => {
    // Get global exclusions from config
    const globalExclusions = merklConfig?.opportunityLibrary.excludeFilters || [];
    // Combine global and local exclusions
    const combinedExclusions = [...globalExclusions, ...exclude];
    // Remove duplicates
    return Array.from(new Set(combinedExclusions));
  }, [exclude]);

  const [sortIdAndOrder, setSortIdAndOrder] = useSearchParamState<[id: (typeof sortable)[number], order: Order]>(
    "sort",
    v => v?.join("-"),
    v => v?.split("-") as [(typeof sortable)[number], order: Order],
  );

  const onSort = useCallback(
    (column: (typeof opportunityColumns)[number], order: Order) => {
      if (!sortable.some(s => s === column)) return;

      setSortIdAndOrder([column as (typeof sortable)[number], order]);
    },
    [sortable, setSortIdAndOrder],
  );

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
            sortable={sortable}
            order={(sortIdAndOrder ?? [])?.[1]}
            sort={(sortIdAndOrder ?? [])?.[0] ?? "rewards"}
            onSort={onSort}
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
            {count !== undefined && (
              <Box content="sm" className="w-full">
                <Pagination count={count} />
              </Box>
            )}
          </Group>
        );
    }
  }, [opportunities, view, count, sortable, onSort, sortIdAndOrder]);

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
