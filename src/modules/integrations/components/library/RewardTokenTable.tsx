import { createTable } from "dappkit";

export const [RewardTokenTable, RewardTokenRow, rewardTokenColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
  token: {
    name: "Token",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
  type: {
    name: "Type",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
  price: {
    name: "Price",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
  minAmount: {
    name: "Min amount/hour",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
  address: {
    name: "Address",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
});
