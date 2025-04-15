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
    size: "minmax(350px,1fr)",
    className: "justify-start",
    main: true,
  },
  test: {
    name: "",
    size: "minmax(50px,1fr)",
    className: "justify-start",
    main: true,
  },
  price: {
    name: "",
    size: "minmax(50px,1fr)",
    className: "justify-start",
    main: true,
  },
  point: {
    name: "",
    size: "minmax(50px,1fr)",
    className: "justify-start",
    main: true,
  },
  minAmount: {
    name: "Minimum Amount / Hour",
    size: "minmax(100px,1fr)",
    className: "justify-start",
    main: true,
  },
});
