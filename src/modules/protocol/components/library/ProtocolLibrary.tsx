import Pagination from "@core/components/element/Pagination";
import ProtocolFilters from "@core/modules/protocol/components/ProtocolFilters";
// import ProtocolCell from "@core/modules/protocol/components/element/ProtocolCell";
import type { Protocol, Chain } from "@merkl/api";
import { Box, Group, List, Title, Text, Button, Icon } from "dappkit";
import { useLocation, useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import merklConfig from "../../../../config";
import type { OpportunityView } from "@core/config/opportunity";
import ProtocolCell from "../element/ProtocolCell";
import { ProtocolTable } from "./ProtocolTable";
import ProtocolTableRow from "../element/ProtocolTableRow";

export type ProtocolLibraryProps = {
  protocols: Protocol[];
  count: number;
  chains?: Chain[];
  forceView?: OpportunityView;
};

export default function ProtocolLibrary({ protocols, count, forceView, chains }: ProtocolLibraryProps) {
  // const cells = useMemo(() => protocols?.map(p => <ProtocolCell key={`${p.name}`} protocol={p} />), [protocols]);

  const [view, setView] = useState<OpportunityView>(forceView ?? merklConfig.opportunityLibrary.defaultView ?? "table");

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
            ctaHeader={
              (merklConfig.opportunityLibrary?.views == null || merklConfig.opportunityLibrary?.views?.length > 1) &&
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
            {protocols?.map(p => (
              <ProtocolTableRow key={`${p.name}`} protocol={p} />
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
              <Group className="grid md:grid-cols-2 lg:grid-cols-4" size="lg">
                {protocols?.map(p => (
                  <ProtocolCell
                    // navigationMode={merklConfig.opportunityNavigationMode}
                    // key={`${p.name}_${p.type}_${p.identifier}`}
                    key={p.name}
                    protocol={p}
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
  }, [protocols, view, count]);

  return (
    // <Group className="flex-col lg:my-xl">
    //   <Group className="w-full mb-xl">
    //     <ProtocolFilters />
    //   </Group>
    //   <div className="w-full overflow-x-scroll lg:overflow-x-auto">
    //     <Group className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-lg md:gap-xl mb-xl w-full justify-center">
    //       {cells}
    //     </Group>
    //     {count !== undefined && <Pagination count={count} />}
    //   </div>
    // </Group>

    <div className="w-full">
      <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
        <ProtocolFilters
          {...{ chains, view, setView }}
          // exclude={mergedExclusions}
          onClear={handleClearFilters}
          clearing={clearing}
        />
      </Box>

      {count === 0 ? (
        <List dividerClassName={() => "bg-accent-11"}>
          <Box size="lg" className="!p-lg !rounded-lg+md">
            <Group className="justify-between">
              <Text look="hype" size={5}>
                {count ?? ""} Opportunities
              </Text>
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
