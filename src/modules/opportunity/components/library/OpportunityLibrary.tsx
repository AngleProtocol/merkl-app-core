import { useMerklConfig } from "@core/modules/config/config.context";
import type { Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { useLocation, useNavigate } from "@remix-run/react";
import { Box, Button, Group, Icon, List, Text, Title } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "../../../../components/element/Pagination";
import type { OpportunityView } from "../../../../config/opportunity";
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

  const navigate = useNavigate();
  const location = useLocation();
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (clearing) {
      setClearing(false);
    }
  }, [clearing]);

  const handleClearFilters = useCallback(() => {
    setClearing(true);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate]);

  const { OpportunityTable } = useOpportunityTable();

  const display = useMemo(() => {
    switch (view) {
      case "table":
        return (
          <OpportunityTable
            responsive
            exclude={["tvl"]}
            opportunityHeader={
              <Title look="hype" h={5}>
                {count ?? ""} Opportunities
              </Title>
            }
            dividerClassName={index => (index < 2 ? "bg-accent-11" : "bg-main-8")}
            ctaHeader={
              (opportunityLibraryViews == null || opportunityLibraryViews?.length > 1) &&
              view && (
                <Group className="flex-nowrap" size="sm">
                  <Button look="soft" onClick={() => setView?.("cells")}>
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
                navigationMode={opportunityNavigationMode}
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
                <Text look="hype" size={5}>
                  {count ?? ""} Opportunities
                </Text>
                {(opportunityLibraryViews == null || opportunityLibraryViews?.length > 1) && view && (
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
              <Group className="grid md:grid-cols-2 lg:grid-cols-3" size="lg">
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
  }, [opportunities, view, count, OpportunityTable, opportunityNavigationMode, opportunityLibraryViews]);

  return (
    <div className="w-full">
      {!hideFilters && (
        <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
          <OpportunityFilters
            {...{ only, chains, protocols, view, setView }}
            exclude={mergedExclusions}
            onClear={handleClearFilters}
            clearing={clearing}
          />
        </Box>
      )}

      {count === 0 ? (
        <List dividerClassName={() => "bg-accent-11"}>
          <Box size="lg" className="!p-lg !rounded-lg+md">
            <Group className="justify-between">
              <Text look="hype" size={5}>
                {count ?? ""} Opportunities
              </Text>
              {(opportunityLibraryViews == null || opportunityLibraryViews?.length > 1) && view && (
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
          <Box className="py-xl*4 flex items-center justify-center gap-xl">
            <Text size="lg" className="flex items-center gap-md" bold>
              <Icon remix="RiErrorWarningFill" />
              No opportunity yet :)
            </Text>
            <Button onClick={handleClearFilters}>
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
