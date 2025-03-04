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

export const columns = {
  protocol: {
    name: (
      <Title h={5} look="soft">
        Protocols
      </Title>
    ),
    size: "minmax(400px,1fr)",
    className: "justify-start",
    main: true,
  },
  liveCampaigns: {
    name: "Live Campaigns",
    size: "minmax(min-content,150px)",
    className: "justify-end",
  },
  rewards: {
    name: "Daily Rewards",
    size: "minmax(min-content,120px)",
    className: "md:justify-center",
  },
  cta: {
    name: "",
    size: "36px",
    className: "md:justify-center",
  },
};

const filteredProtocolColumns = filterColumns(columns);
export const [ProtocolTable, ProtocolRow, protocolColumns] = createTable(filteredProtocolColumns);
