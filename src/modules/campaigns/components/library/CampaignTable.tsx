import { createTable } from "dappkit";

export const [CampaignTable, CampaignRow, campaignColumns] = createTable({
  dailyRewards: {
    name: "",
    size: "minmax(min-content,1fr)",
    className: "justify-start",
    main: true,
  },
  timeRemaining: {
    name: "",
    size: "minmax(min-content,300px)",
    className: "justify-end",
  },
});
