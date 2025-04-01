import { useMerklConfig } from "@core/modules/config/config.context";
import type { Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Icon, List, Text } from "dappkit";
import { useMemo, useState } from "react";
import Pagination from "../../../../components/element/Pagination";
import type { OpportunityView } from "../../../../config/opportunity";
import useOpportunityFilters from "../../hooks/useOpportunityFilters";
import useOpportunityTable from "../../hooks/useOpportunityTable";
import OpportunityFilters, { type OpportunityFilterProps } from "../OpportunityFilters";
import OpportunityCell from "../items/OpportunityCell";
import OpportunityTableRow from "../items/OpportunityTableRow";

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
  const opportunityLibraryDefaultView = useMerklConfig(store => store.config.opportunityLibrary.defaultView);
  const opportunityLibraryViews = useMerklConfig(store => store.config.opportunityLibrary?.views);
  const excludeFilters = useMerklConfig(store => store.config.opportunityLibrary?.excludeFilters);
  const opportunityNavigationMode = useMerklConfig(store => store.config.opportunityNavigationMode);

  // Merge global and local exclusions
  const mergedExclusions = useMemo(() => {
    // Get global exclusions from config
    const globalExclusions = excludeFilters || [];
    // Combine global and local exclusions
    const combinedExclusions = [...globalExclusions, ...exclude];
    // Remove duplicates
    return Array.from(new Set(combinedExclusions));
  }, [exclude, excludeFilters]);

  const [view, setView] = useState<OpportunityView>(forceView ?? opportunityLibraryDefaultView ?? "table");
  const { clearFilters } = useOpportunityFilters();

  const { OpportunityTable } = useOpportunityTable(undefined, count);

  const renderSwitchDisplayButton = useMemo(() => {
    if (opportunityLibraryViews === null) return null;
    if (opportunityLibraryViews?.length === 1) return null;
    if (!view) return null;
    return (
      <Group className="flex-nowrap" size="sm">
        {view === "table" && (
          <Button look="soft" onClick={() => setView?.("cells")}>
            <Icon remix="RiDashboardFill" />
          </Button>
        )}
        {view === "cells" && (
          <Button look="soft" onClick={() => setView?.("table")} className={"min-w-[64px] justify-center"}>
            <Icon remix="RiSortDesc" />
          </Button>
        )}
      </Group>
    );
  }, [view, opportunityLibraryViews]);

  const display = useMemo(() => {
    switch (view) {
      case "table":
        return (
          <OpportunityTable
            responsive
            exclude={["tvl"]}
            dividerClassName={() => "bg-main-6"}
            ctaHeader={renderSwitchDisplayButton}
            footer={count !== undefined && <Pagination count={count} />}>
            {opportunities?.map(o => (
              <OpportunityTableRow
                navigationMode={opportunityNavigationMode}
                key={`${o.chainId}_${o.type}_${o.identifier}`}
                opportunity={o}
              />
            ))}
          </OpportunityTable>
        );
      case "cells":
        return (
          <List dividerClassName={() => "bg-main-6"}>
            <Box size="lg" className="!p-lg !rounded-lg+md">
              <Group className="justify-between">
                <Text look="soft" size={5}>
                  {count ?? ""} Opportunities
                </Text>
                {renderSwitchDisplayButton}
              </Group>
            </Box>
            <Box>
              <Group className="grid md:grid-cols-2 lg:grid-cols-3 my-md" size="lg">
                {opportunities?.map(o => (
                  <OpportunityCell
                    navigationMode={opportunityNavigationMode}
                    key={`${o.chainId}_${o.type}_${o.identifier}`}
                    opportunity={o}
                  />
                ))}
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
  }, [opportunities, view, count, OpportunityTable, opportunityNavigationMode, renderSwitchDisplayButton]);

  return (
    <div className="w-full">
      {!hideFilters && (
        <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
          <OpportunityFilters {...{ only, chains, protocols, view, setView }} exclude={mergedExclusions} />
        </Box>
      )}

      {count === 0 ? (
        <List dividerClassName={() => "bg-accent-11"}>
          <Box size="lg" className="!p-lg !rounded-lg+md">
            <Group className="justify-between">
              <Text look="hype" size={5}>
                {count ?? ""} Opportunities
              </Text>
              {renderSwitchDisplayButton}
            </Group>
          </Box>
          <Box className="py-xl*4 flex items-center justify-center gap-xl">
            <Text size="lg" className="flex items-center gap-md" bold>
              <Icon remix="RiErrorWarningFill" />
              No opportunity yet :)
            </Text>
            <Button onClick={clearFilters}>
              Clear all filters <Icon remix="RiArrowRightLine" />
            </Button>
          </Box>
          {count !== undefined && (
            <Box content="sm" className="w-full">
              <Pagination count={count} />
            </Box>
          )}
        </List>
      ) : (
        display
      )}
    </div>
  );
}
