import { createTable } from "dappkit";

export const [LeaderboardTable, LeaderboardRow, LeaderboardColumns] = createTable({
  rank: {
    name: "Rank",
    size: "minmax(120px,150px)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  address: {
    name: "Address",
    size: "minmax(170px,1fr)",
    compactSize: "1fr",
    className: "justify-start",
  },
  rewards: {
    name: "Rewards earned",
    size: "minmax(30px,1fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-start",
  },
  protocol: {
    name: "Via",
    size: "minmax(30px,0.5fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
});

export const [LeaderboardTableWithoutReason, LeaderboardRowWithoutReason, LeaderboardColumnsWithoutReason] =
  createTable({
    rank: {
      name: "Rank",
      size: "minmax(120px,150px)",
      compact: "1fr",
      className: "justify-start",
      main: true,
    },
    address: {
      name: "Address",
      size: "minmax(170px,1fr)",
      compactSize: "1fr",
      className: "justify-start",
    },
    rewards: {
      name: "Rewards earned",
      size: "minmax(30px,1fr)",
      compactSize: "minmax(20px,1fr)",
      className: "justify-start",
    },
  });
