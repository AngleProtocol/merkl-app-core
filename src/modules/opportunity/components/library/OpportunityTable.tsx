import { Title, createTable } from "dappkit";

const columns = {
  opportunity: {
    name: (
      <Title h={5} look="soft">
        Opportunities
      </Title>
    ),
    size: "minmax(400px,1fr)",
    className: "justify-start",
    main: true,
  },
  action: {
    name: "Action",
    size: "minmax(min-content,150px)",
    className: "justify-end",
  },
  apr: {
    name: "APR",
    size: "minmax(min-content,80px)",
    className: "md:justify-center",
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,100px)",
    className: "md:justify-center",
  },
  rewards: {
    name: "Daily rewards",
    size: "minmax(200px,400px)",
    className: "md:justify-center",
  },
  cta: {
    name: "",
    size: "36px",
    className: "md:justify-center",
  },
};

export const [OpportunityTable, OpportunityRow, opportunityColumns] = createTable(columns);
