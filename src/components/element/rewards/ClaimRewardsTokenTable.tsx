import { createTable } from "dappkit";

export const [ClaimRewardsTokenTable, ClaimRewardsTokenRow, claimRewardsTokenColumns] = createTable({
  token: {
    name: "Token",
    size: "minmax(200px,1fr)",
    className: "justify-start",
    main: true,
  },
  amount: {
    name: "Claimable Now",
    size: "minmax(200px,250px)",
    className: "justify-start",
  },
  pending: {
    name: "Claimable Soon",
    size: "minmax(200px,250px)",
    className: "justify-start",
  },
  claimed: {
    name: "Claimed",
    size: "minmax(200px,250px)",
    className: "justify-start",
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
