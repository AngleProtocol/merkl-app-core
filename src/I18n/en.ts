//TODO: embed this in merkl config
//@ts-ignore
import clientEn from "../../../../I18n/en";

const en = {
  pages: {
    home: {
      metaTitle: "Merkl",
      depositInformation: "",
    },
    opportunities: {
      metaTitle: "Merkl | Opportunities",
      title: "Explore opportunities",
      description: "Browse opportunities, compare rewards, and earn tokens",
    },
    campaigns: {
      metaTitle: "Merkl | Campaigns",
      title: "Explore opportunities",
      description: "Browse opportunities, compare rewards, and earn tokens",
    },
    bridge: {
      metaTitle: "Merkl | Bridge",
      helper: "",
    },
    dashboard: {
      metaTitle: "Merkl | Dashboard",
      title: "Dashboard",
      explanation:
        "Pending rewards are updated approximately every 4 hours, but are claimable onchain once every week.\nIf you don’t claim your rewards from a week, you may always claim them at a later time.",
      reinvest: "",
    },
    tokens: {
      metaTitle: "Merkl | Tokens",
      description: "Tokens indexed by Merkl",
    },
    chains: {
      metaTitle: "Merkl | Chains",
      description: "Chains integrated by Merkl",
    },
    protocols: {
      metaTitle: "Merkl | Protocols",
      title: "Protocols",
      description: "Explore protocols incentivized on Merkl",
    },
    leaderboard: {
      metaTitle: "Merkl | Leaderboard Per Token",
    },
  },
};

export default Object.assign(en, clientEn);
