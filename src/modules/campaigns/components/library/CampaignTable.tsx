import { createTable } from "dappkit";

export const [CampaignTable, CampaignRow, campaignColumns] = createTable({
  dailyRewards: {
    name: "Daily rewards",
    size: "minmax(170px,1fr)",
    compactSize: "1fr",
    className: "justify-start",
    main: true,
  },
  chain: {
    name: "Distribution chain",
    size: "minmax(30px,150px)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-center",
  },
  timeRemaining: {
    name: "End",
    size: "minmax(100px,200px)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-center",
  },
});
