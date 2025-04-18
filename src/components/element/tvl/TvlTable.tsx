import { createTable } from "dappkit";

export const [TvlTable, TvlRow, tvlColumns] = createTable({
  name: {
    name: "TVL details",
    size: "minmax(350px,1fr)",
    className: "justify-start",
    main: true,
  },
  apr: {
    name: "APR",
    size: "minmax(min-content,150px)",
    className: "justify-center",
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,150px)",
    className: "justify-center",
  },
});
