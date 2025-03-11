import merklConfig from "@core/config";
import type { Opportunity } from "@merkl/api";
import { createTable } from "dappkit";
import { type ReactNode, useMemo } from "react";
import OpportunityCellApr from "../components/element/OpportunityCellApr";
import OpportunityCellDailyRewards from "../components/element/OpportunityCellDailyRewards";
import OpportunityCellTvl from "../components/element/OpportunityCellTvl";
import type { OpportuntyLibraryOverride } from "../opportunity.model";

const defaultColumns: OpportuntyLibraryOverride<"cell"> = {
  dailyRewards: {
    name: "Daily rewards",
    cell: opportunity => <OpportunityCellDailyRewards opportunity={opportunity} />,
  },
  apr: {
    name: "APR",
    cell: opportunity => <OpportunityCellApr opportunity={opportunity} />,
  },
  tvl: {
    name: "TVL",
    cell: opportunity => <OpportunityCellTvl opportunity={opportunity} />,
  },
};

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityCell(opportunity?: Opportunity) {
  const columnConfig = merklConfig.opportunity.library.overrideCell;
  const columns = useMemo(() => {
    if (!columnConfig) return defaultColumns;

    return Object.entries(columnConfig).reduce(
      (cols, [key, definition]) => {
        if (typeof definition === "boolean" && definition && defaultColumns[key]) cols[key] = defaultColumns[key];
        else cols[key] = definition;
        return cols;
      },
      {} as OpportuntyLibraryOverride<"cell">,
    ) as OpportuntyLibraryOverride<"cell", false>;
  }, [columnConfig]);

  const [OpportunityTable, OpportunityRow, cols] = useMemo(() => {
    return createTable(columns as OpportuntyLibraryOverride<"cell", false>);
  }, [columns]);

  const opportunityMetrics = useMemo(() => {
    if (!opportunity) return;

    return Object.entries(columns as OpportuntyLibraryOverride<"cell", false>).reduce(
      (cols, [key, { cell }]) => {
        cols[`${key}`] = cell?.(opportunity);
        return cols;
      },
      {} as { [K: string]: ReactNode },
    );
  }, [columns, opportunity]);

  return {
    OpportunityTable,
    opportunityMetrics,
    OpportunityRow,
    cols,
  };
}
