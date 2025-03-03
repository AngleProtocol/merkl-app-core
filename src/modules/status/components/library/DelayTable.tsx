import { createTable } from "dappkit";

export const [DelayTable, DelayRow, statusColumns] = createTable({
  computeChain: {
    name: "Compute Chain",
    size: "minmax(100px,0.5fr)",
    className: "justify-start",
    main: true,
  },
  campaign: {
    name: "Campaign",
    size: "minmax(100px,0.5fr)",
    className: "justify-start",
    main: true,
  },
  opportunity: {
    name: "Opportunity",
    size: "minmax(250px,1fr)",
    className: "justify-start",
    main: true,
  },
  delay: {
    name: "Delay",
    size: "minmax(250px,1fr)",
    className: "justify-start",
    main: true,
  },
  reason: {
    name: "Reason",
    size: "minmax(250px,1fr)",
    className: "justify-start",
    main: true,
  },
});
