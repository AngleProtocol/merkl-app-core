import { createTable } from "dappkit";

export const [ClaimRewardsChainTable, ClaimRewardsChainRow, claimRewardsChainColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(280px,1fr)",
    className: "justify-start",
    main: true,
  },
  unclaimed: {
    name: "Claimable Now",
    size: "minmax(100px,150px)",
    className: "justify-end",
  },
  // pending: {
  //   name: "Claimable Soon",
  //   size: "minmax(min-content,150px)",
  //   className: "justify-end",
  // },
  // claimed: {
  //   name: "Claimed",
  //   size: "minmax(100px,150px)",
  //   className: "justify-end",
  // },
});
