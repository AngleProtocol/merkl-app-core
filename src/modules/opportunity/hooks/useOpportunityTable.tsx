import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Title, createTable } from "dappkit";
import { type ReactNode, useMemo } from "react";
import OpportunityTableApr from "../components/element/OpportunityTableApr";
import OpportunityTableDailyRewards from "../components/element/OpportunityTableDailyRewards";
import OpportunityTableName from "../components/element/OpportunityTableName";
import OpportunityTableTvl from "../components/element/OpportunityTableTvl";
import type { OpportuntyLibraryOverride } from "../opportunity.model";
import useOpportunityFilters, { SortOrder } from "./useOpportunityFilters";

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityTable(opportunity?: Opportunity, count?: number) {
  const columnConfig = useMerklConfig(store => store.config.opportunity.library.overrideDisplay);
  const { filtersState, toggleSortOrder } = useOpportunityFilters();

  const defaultColumns: OpportuntyLibraryOverride<"table"> | undefined = useMemo(() => {
    const sortBase = filtersState.sortFilter.input?.split("-")?.[0];
    const sortOrder = filtersState.sortFilter.input?.split("-")?.[1];
    return {
      name: {
        name: (
          <Title h={5} look="soft">
            {count} Opportunities
          </Title>
        ),
        size: "minmax(400px,1fr)",
        className: "justify-start",
        main: true,
        table: (opportunity: Opportunity) => <OpportunityTableName opportunity={opportunity} />,
      },
      apr: {
        name: (
          <Group onClick={() => toggleSortOrder("apr")} className="cursor-pointer">
            APR
            {sortBase === "apr" && <Icon remix={sortOrder === SortOrder.DESC ? "RiArrowDownLine" : "RiArrowUpLine"} />}
          </Group>
        ),
        size: "minmax(100px,115px)",
        className: "md:justify-center",
        table: (opportunity: Opportunity) => <OpportunityTableApr opportunity={opportunity} />,
      },
      tvl: {
        name: (
          <Group onClick={() => toggleSortOrder("tvl")} className="cursor-pointer">
            TVL
            {sortBase === "tvl" && <Icon remix={sortOrder === SortOrder.DESC ? "RiArrowDownLine" : "RiArrowUpLine"} />}
          </Group>
        ),
        size: "minmax(100px,115px)",
        className: "md:justify-center",
        table: (opportunity: Opportunity) => <OpportunityTableTvl opportunity={opportunity} />,
      },
      dailyRewards: {
        name: (
          <Group onClick={() => toggleSortOrder("rewards", SortOrder.DESC)} className="cursor-pointer">
            Daily rewards
            {sortBase === "rewards" && (
              <Icon remix={sortOrder === SortOrder.DESC ? "RiArrowDownLine" : "RiArrowUpLine"} />
            )}
          </Group>
        ),
        size: "minmax(120px,130px)",
        className: "md:justify-end text-nowrap",
        table: (opportunity: Opportunity) => <OpportunityTableDailyRewards opportunity={opportunity} />,
      },
      cta: {
        name: "",
        size: "64px",
        className: "md:justify-center",
        table: () => (
          <Button look="hype">
            <Icon remix="RiArrowRightLine" />
          </Button>
        ),
      },
    };
  }, [count, toggleSortOrder, filtersState.sortFilter.input]);

  const columns = useMemo(() => {
    if (!defaultColumns) return null;
    if (!columnConfig) return defaultColumns;
    return Object.entries(columnConfig).reduce(
      (cols, [key, definition]) => {
        if (typeof definition === "boolean" && definition && defaultColumns[key]) cols[key] = defaultColumns[key];
        else cols[key] = definition;
        return cols;
      },
      {} as OpportuntyLibraryOverride<"table">,
    ) as OpportuntyLibraryOverride<"table", false>;
  }, [columnConfig, defaultColumns]);

  const [OpportunityTable, OpportunityRow, cols] = useMemo(() => {
    return createTable(columns as OpportuntyLibraryOverride<"table", false>);
  }, [columns]);

  const opportunityColumns = useMemo(() => {
    if (!opportunity) return;

    return Object.entries(columns as OpportuntyLibraryOverride<"table", false>).reduce(
      (cols, [key, { table }]) => {
        cols[`${key}Column`] = table?.(opportunity);
        return cols;
      },
      {} as { [K: string]: ReactNode },
    );
  }, [columns, opportunity]);

  return {
    OpportunityTable,
    opportunityColumns,
    OpportunityRow,
    cols,
  };
}
