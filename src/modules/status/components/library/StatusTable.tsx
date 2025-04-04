import { createTable } from "dappkit";

export const [StatusTable, StatusRow, statusColumns] = createTable({
  status: {
    name: "Status",
    size: "minmax(70px,0.1fr)",
    className: "justify-start",
    main: true,
  },
  chain: {
    name: "Chain",
    size: "minmax(200px,0.5fr)",
    className: "justify-start",
    main: true,
  },
  live: {
    name: "# of Live Campaigns",
    size: "minmax(100px,0.5fr)",
    className: "justify-start",
    main: true,
  },
  delay: {
    name: "Delayed Compute",
    size: "minmax(100px,0.3fr)",
    className: "justify-start",
    main: true,
  },
  update: {
    name: "Last Chain Update",
    size: "minmax(150px,0.5fr)",
    className: "justify-start",
    main: true,
  },
  tree: {
    name: "Tree",
    size: "minmax(70px,0.3fr)",
    className: "justify-start",
    main: true,
  },
  lastTree: {
    name: "Last tree",
    size: "minmax(70px,0.3fr)",
    className: "justify-start",
    main: true,
  },
  contracts: {
    name: "Contracts",
    size: "minmax(350px,1.5fr)",
    className: "justify-start",
    main: true,
  },
});
