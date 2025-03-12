import { createTable } from "dappkit";

export const [LeaderboardTable, LeaderboardRow, LeaderboardColumns] = createTable({
  rank: {
    name: "Rank",
    size: "minmax(120px,150px)",
    className: "justify-start",
    main: true,
  },
  address: {
    name: "Address",
    size: "minmax(130px,170px)",
    className: "justify-start",
  },
  rewards: {
    name: "Rewards earned",
    size: "minmax(300px,auto)",
    className: "justify-start",
  },
  protocol: {
    name: "Via",
    size: "minmax(90px,auto)",
    className: "justify-end",
  },
});

export const [LeaderboardTableWithoutReason, LeaderboardRowWithoutReason, LeaderboardColumnsWithoutReason] =
  createTable({
    rank: {
      name: "Rank",
      size: "minmax(120px,150px)",
      className: "justify-start",
      main: true,
    },
    address: {
      name: "Address",
      size: "minmax(170px,1fr)",

      className: "justify-start",
    },
    rewards: {
      name: "Rewards earned",
      size: "minmax(30px,1fr)",
      className: "justify-start",
    },
  });
