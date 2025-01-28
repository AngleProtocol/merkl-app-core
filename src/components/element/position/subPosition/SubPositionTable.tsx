import { createTable } from "dappkit";

export const [SubPositionTable, SubPositionRow, SubPositionColumns] = createTable({
  source: {
    name: "Source",
    size: "minmax(120px,1fr)",
    className: "justify-start",
    main: true,
  },
  inRange: {
    name: "In range",
    size: "minmax(30px,0.2fr)",
    className: "justify-start",
  },
  liquidity: {
    name: "Liquidity",
    size: "minmax(30px,0.2fr)",
    className: "justify-end",
  },
  token0: {
    name: "Token 1",
    size: "minmax(30px,0.45fr)",
    className: "justify-end",
  },
  token1: {
    name: "Token 2",
    size: "minmax(30px,0.45fr)",
    className: "justify-end",
  },
});
