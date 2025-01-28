import { createTable } from "dappkit";

export const [ClaimRewardsTableByOpportunity, ClaimRewardsByOpportunityRow, claimRewardsByOpportunityColumns] =
  createTable({
    positions: {
      name: "Positions",
      size: "minmax(250px,1fr)",
      compact: "1fr",
      className: "justify-start",
      main: true,
    },
    // action: {
    //   name: "Actions",
    //   size: "minmax(min-content,200px)",
    //   className: "justify-end",
    // },
    unclaimed: {
      name: "Unclaimed",
      size: "minmax(100px,1fr)",
      className: "justify-end text-right",
    },
    pending: {
      name: "Claimable Soon",
      size: "minmax(150px,1fr)",
      className: "justify-end text-right",
    },
    claimed: {
      name: "Claimed",
      size: "minmax(100px,1fr)",
      className: "justify-end text-right",
    },
    /*
    button: {
      name: "",
      size: "minmax(min-content,100px)",
      className: "justify-end",
    },
    */
  });
