import { Title, createTable } from "dappkit";
import merklConfig from "../../../../config";

// biome-ignore lint/suspicious/noExplicitAny: TODO
export function filterColumns<T extends Record<string, any>>(columns: T): T {
  const libraryColumnsConfig = merklConfig.opportunity?.library?.columns;
  if (!libraryColumnsConfig) return columns;
  const disabledColumns = Object.entries(libraryColumnsConfig)
    .filter(([, settings]) => settings.enabled === false)
    .map(([key]) => key);

  const filteredColumns = Object.fromEntries(
    Object.entries(columns).filter(([key]) => !disabledColumns.includes(key)),
  ) as T;

  return filteredColumns;
}

export const opportunityColumns = {
  opportunity: {
    name: (
      <Title h={5} look="soft">
        Opportunities
      </Title>
    ),
    size: "minmax(350px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  action: {
    name: "Action",
    size: "minmax(50px,150px)",
    compactSize: "minmax(50px,50px)",
    className: "justify-end",
  },
  apr: {
    name: "APR",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
  rewards: {
    name: "Daily rewards",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
};

const filteredOpportunityColumns = filterColumns(opportunityColumns);
export const [OpportunityTable, OpportunityRow, filteredColumns] = createTable(filteredOpportunityColumns);
