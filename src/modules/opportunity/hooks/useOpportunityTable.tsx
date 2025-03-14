import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Icon, Title, createTable } from "dappkit";
import { type ReactNode, useMemo } from "react";
import OpportunityTableApr from "../components/element/OpportunityTableApr";
import OpportunityTableDailyRewards from "../components/element/OpportunityTableDailyRewards";
import OpportunityTableName from "../components/element/OpportunityTableName";
import OpportunityTableTvl from "../components/element/OpportunityTableTvl";
import type { OpportuntyLibraryOverride } from "../opportunity.model";

const defaultColumns: OpportuntyLibraryOverride<"table"> = {
  name: {
    name: (
      <Title h={5} look="soft">
        Opportunities
      </Title>
    ),
    size: "minmax(400px,1fr)",
    className: "justify-start",
    main: true,
    table: opportunity => <OpportunityTableName opportunity={opportunity} />,
  },
  action: {
    name: "Action",
    size: "minmax(min-content,150px)",
    className: "justify-end",
    table: opportunity => <OpportunityTableName opportunity={opportunity} />,
  },
  apr: {
    name: "APR",
    size: "minmax(min-content,80px)",
    className: "md:justify-center",
    table: opportunity => <OpportunityTableApr opportunity={opportunity} />,
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,100px)",
    className: "md:justify-center",
    table: opportunity => <OpportunityTableTvl opportunity={opportunity} />,
  },
  dailyRewards: {
    name: "Daily rewards",
    size: "minmax(150px,180px)",
    className: "md:justify-center",
    table: opportunity => <OpportunityTableDailyRewards opportunity={opportunity} />,
  },
  cta: {
    name: "",
    size: "36px",
    className: "md:justify-center",
    table: () => (
      <Button look="hype">
        <Icon remix="RiArrowRightLine" />
      </Button>
    ),
  },
};

/**
 * Formats rewards for a given opportunity
 */
export default function useOpportunityTable(opportunity?: Opportunity) {
  const columnConfig = useMerklConfig(store => store.config.opportunity.library.overrideDisplay);

  const columns = useMemo(() => {
    if (!columnConfig) return defaultColumns;

    return Object.entries(columnConfig).reduce(
      (cols, [key, definition]) => {
        if (typeof definition === "boolean" && definition && defaultColumns[key]) cols[key] = defaultColumns[key];
        else cols[key] = definition;
        return cols;
      },
      {} as OpportuntyLibraryOverride<"table">,
    ) as OpportuntyLibraryOverride<"table", false>;
  }, [columnConfig]);

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
