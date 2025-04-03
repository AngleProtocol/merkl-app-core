import { createTable } from "dappkit";

export const [HistoricalClaimsTable, HistoricalClaimsRow, HistoricalClaimsColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(150px, 400px)",
    className: "justify-start",
  },
  token: {
    name: "Token",
    size: "minmax(250px, 1fr)",
    className: "justify-start",
  },
  date: {
    name: "Date",
    size: "minmax(150px, 200px)",
    className: "justify-start",
  },
  transaction: {
    name: "Transaction",
    size: "minmax(100px, 120px)",
    className: "justify-end",
  },
});
