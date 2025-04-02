import type { OpportunityView } from "@core/config/opportunity";
import { useMerklConfig } from "@core/modules/config/config.context";
import ProtocolFilters from "@core/modules/protocol/components/ProtocolFilters";
import type { Chain, Protocol } from "@merkl/api";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Box, Button, Group, Icon, List, Text, Title } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProtocolCell from "../element/ProtocolCell";
import ProtocolTableRow from "../element/ProtocolTableRow";
import { ProtocolTable } from "./ProtocolTable";

export type ProtocolLibraryProps = {
  protocols: Protocol[];
  count: number;
  chains?: Chain[];
  forceView?: OpportunityView;
};

/**
 * @Information Custom Pagination and front filtering for protocols to allow computed fields filtering to replace when protcols metadata jobs are up tos tore this datas in api database
 */
export default function ProtocolLibrary({ protocols: protocolsProps, count, forceView }: ProtocolLibraryProps) {
  const opportunityLibraryDefaultView = useMerklConfig(store => store.config.opportunityLibrary.defaultView);
  const opportunityLibraryViews = useMerklConfig(store => store.config.opportunityLibrary?.views);
  const [view, setView] = useState<OpportunityView>(forceView ?? opportunityLibraryDefaultView ?? "table");

  // ---- Start of Custom Pagination and front filtering
  //  Custom Pagination and front filtering (to be removed when protocols metadata jobs are up to store this datas in api database)
  const [searchParams] = useSearchParams();

  const protocols = useMemo(() => {
    const filter = searchParams.get("sort") ?? "rewards-desc";
    const search = searchParams.get("search")?.toLowerCase();
    const actionParam = searchParams.get("action");

    // Convert actionParam into an array if present
    const actionFilters = actionParam ? actionParam.split(",") : [];

    return [...protocolsProps]
      .sort((a, b) => {
        const rewardA = a.dailyRewards ?? 0;
        const rewardB = b.dailyRewards ?? 0;
        const campaignsA = a.numberOfLiveCampaigns ?? 0;
        const campaignsB = b.numberOfLiveCampaigns ?? 0;

        if (filter === "rewards-asc") return rewardA - rewardB;
        if (filter === "rewards-desc") return rewardB - rewardA;
        if (filter === "campaigns-asc") return campaignsA - campaignsB;
        if (filter === "campaigns-desc") return campaignsB - campaignsA;
        return 0;
      })
      .filter(p => {
        if (search && !p.name.toLowerCase().includes(search)) return false;
        if (actionFilters.length > 0) {
          const tags = p.opportunityLiveTags ?? [];
          if (!actionFilters.some(action => tags.includes(action))) return false;
        }

        return true;
      });
  }, [protocolsProps, searchParams.get]);

  // ---- End of Custom Pagination and front filtering

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
          <Button look="soft" onClick={() => setView?.("table")} className="min-w-[36px] justify-center">
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
          <ProtocolTable
            responsive
            protocolHeader={
              <Title look="hype" h={5}>
                {count ?? ""} Protocols
              </Title>
            }
            dividerClassName={index => (index < 2 ? "bg-accent-11" : "bg-main-8")}
            ctaHeader={renderSwitchDisplayButton}>
            {protocols?.map(p => (
              <ProtocolTableRow key={`${p.id}`} protocol={p} />
            ))}
          </ProtocolTable>
        );
      case "cells":
        return (
          <List dividerClassName={() => "bg-accent-11"}>
            <Box size="lg" className="!p-lg !rounded-lg+md">
              <Group className="justify-between">
                <Text look="hype" size={5}>
                  {count ?? ""} Protocols
                </Text>
                {renderSwitchDisplayButton}
              </Group>
            </Box>
            <Box>
              <Group className="grid md:grid-cols-2 lg:grid-cols-4" size="lg">
                {protocols?.map(p => (
                  <ProtocolCell key={p.id} protocol={p} />
                ))}
              </Group>
            </Box>

            {/* {count !== undefined && (
              <Box content="sm" className="w-full">
                <Pagination count={count} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE_PROTOCOLS} />
              </Box>
            )} */}
          </List>
        );
    }
  }, [protocols, view, count, renderSwitchDisplayButton]);

  return (
    <div className="w-full">
      <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
        <ProtocolFilters {...{ view, setView }} onClear={handleClearFilters} clearing={clearing} />
      </Box>

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
            <Button onClick={handleClearFilters}>
              Clear all filters <Icon remix="RiArrowRightLine" />
            </Button>
          </Box>
          {/* {count !== undefined && (
            <Box content="sm" className="w-full">
              <Pagination count={count} />
            </Box>
          )} */}
        </List>
      ) : (
        display
      )}
    </div>
  );
}
