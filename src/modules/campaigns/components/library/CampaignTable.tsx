import { createTable } from "dappkit";

export const [CampaignTable, CampaignRow, campaignColumns] = createTable({
  dailyRewards: {
    name: "",
    size: "1fr",
    className: "justify-start",
    main: true,
  },
  timeRemaining: {
    name: "",
    size: "auto",
    className: "justify-end",
  },
});
