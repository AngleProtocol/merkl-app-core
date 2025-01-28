import { createTable } from "dappkit";

// TEST
export const [HistoricalClaimsTable, HistoricalClaimsRow, HistoricalClaimsColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(150px, 1fr)",
    className: "justify-start",
  },
  token: {
    name: "Token",
    size: "minmax(150px, 1fr)",
    className: "justify-start",
  },
  date: {
    name: "Date",
    size: "minmax(120px, 1fr)",
    className: "justify-end",
  },
  transaction: {
    name: "Transaction",
    size: "minmax(100px, 1fr)",
    className: "justify-end",
  },
});
