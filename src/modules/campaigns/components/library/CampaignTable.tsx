import { createTable } from "dappkit";

export const [CampaignTable, CampaignRow, campaignColumns] = createTable({
  dailyRewards: {
    name: "Daily rewards",
    size: "minmax(350px,1fr)",
    className: "justify-start",
    main: true,
  },
  chain: {
    name: "Distribution chain",
    size: "minmax(200px,1fr)",
    className: "justify-center",
  },
  timeRemaining: {
    name: "End",
    size: "minmax(150px,1fr)",
    className: "justify-center",
  },
});
