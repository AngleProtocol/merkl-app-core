import { Title, createTable } from "dappkit";

export const columns = {
  protocol: {
    name: (
      <Title h={5} look="soft">
        Protocols
      </Title>
    ),
    size: "minmax(400px,1fr)",
    className: "justify-start",
    main: true,
  },
  liveCampaigns: {
    name: "Live Campaigns",
    size: "minmax(min-content,150px)",
    className: "justify-end",
  },
  rewards: {
    name: "Daily Rewards",
    size: "minmax(min-content,120px)",
    className: "md:justify-center",
  },
  cta: {
    name: "",
    size: "36px",
    className: "md:justify-center",
  },
};

export const [ProtocolTable, ProtocolRow, protocolColumns] = createTable(columns);
