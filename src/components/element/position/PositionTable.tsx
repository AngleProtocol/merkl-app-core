import { createTable } from "dappkit";

export const [PositionTable, PositionRow, PositionColumns] = createTable({
  source: {
    name: "",
    size: "minmax(120px,1fr)",
    className: "justify-start",
    main: true,
  },
  liquidity: {
    name: "Your TVL",
    size: "minmax(30px,0.35fr)",
    className: "justify-end",
  },
  // Disabled for the moment do not have infos yet (ERC20)
  // supplyShare: {
  //   name: "Supply share",
  //   size: "minmax(30px,0.2fr)",
  //   className: "justify-end",
  // },
});
