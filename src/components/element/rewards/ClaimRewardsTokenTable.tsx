import { createTable } from "dappkit";

export const [ClaimRewardsTokenTable, ClaimRewardsTokenRow, claimRewardsTokenColumns] = createTable({
  token: {
    name: "Token",
    size: "minmax(min-content,1fr)",
    className: "justify-start",
    main: true,
  },
  amount: {
    name: "Claimable Now",
    size: "minmax(min-content,200px)",
    className: "justify-end",
  },
  pending: {
    name: "Claimable Soon",
    size: "minmax(min-content,200px)",
    className: "justify-end",
  },
  claimed: {
    name: "Claimed",
    size: "minmax(min-content,200px)",
    className: "justify-end",
  },
});

export type Rewards = {
  [chain: number]: {
    claimed: number;
    unclaimed: number;
    tokens: {
      [address: string]: {
        symbol: string;
        amount: number;
        price: number;
      };
    };
  };
};
