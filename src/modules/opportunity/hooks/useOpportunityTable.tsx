import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Icon, Title, createTable } from "dappkit";
import { type ReactNode, useMemo } from "react";
import OpportunityTableApr from "../components/element/OpportunityTableApr";
import OpportunityTableDailyRewards from "../components/element/OpportunityTableDailyRewards";
import OpportunityTableName from "../components/element/OpportunityTableName";
import OpportunityTableTvl from "../components/element/OpportunityTableTvl";
import type { OpportuntyLibraryOverride } from "../opportunity.model";

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityTable(opportunity?: Opportunity, count?: number) {
  const columnConfig = useMerklConfig(store => store.config.opportunity.library.overrideDisplay);

  const defaultColumns: OpportuntyLibraryOverride<"table"> = useMemo(() => {
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
        table: (opportunity?: Opportunity) =>
          opportunity ? <OpportunityTableName opportunity={opportunity} /> : <></>,
      },
      apr: {
        name: "APR",
        size: "minmax(100px,115px)",
        className: "md:justify-center",
        table: (opportunity?: Opportunity) => (opportunity ? <OpportunityTableApr opportunity={opportunity} /> : <></>),
      },
      tvl: {
        name: "TVL",
        size: "minmax(100px,115px)",
        className: "md:justify-center",
        table: (opportunity?: Opportunity) => (opportunity ? <OpportunityTableTvl opportunity={opportunity} /> : <></>),
      },
      dailyRewards: {
        name: "Daily rewards",
        size: "minmax(100px,115px)",
        className: "md:justify-end text-nowrap",
        table: (opportunity?: Opportunity) =>
          opportunity ? <OpportunityTableDailyRewards opportunity={opportunity} /> : <></>,
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
  }, [count]);

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
