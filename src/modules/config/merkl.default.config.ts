import { http, createClient, custom } from "viem";
import {
  arbitrum,
  astar,
  astarZkEVM,
  avalanche,
  base,
  blast,
  bob,
  bsc,
  coreDao,
  etherlink,
  fantom,
  filecoin,
  fraxtal,
  fuse,
  gnosis,
  immutableZkEvm,
  linea,
  lisk,
  mainnet,
  manta,
  mantle,
  mode,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  rootstock,
  scroll,
  sei,
  taiko,
  thunderCore,
  worldchain,
  xLayer,
} from "viem/chains";
import { eip712WalletActions, zksync } from "viem/zksync";
import { walletConnect } from "wagmi/connectors";
import type { MerklConfig } from "./config.model";

export const defaultMerklConfig: Omit<MerklConfig, "backend" | "routes" | "theme"> = {
  header: {
    searchbar: {
      enabled: false,
    },
  },
  appName: "Merkl",
  navigation: {
    header: {},
    menu: {
      dashboard: {
        icon: { remix: "RiDashboardFill" },
        link: "/users/",
        name: "Claims",
      },
      opportunities: {
        icon: { remix: "RiPlanetFill" },
        link: "/",
        name: "Claims",
      },
      documentation: {
        icon: { remix: "RiFile4Fill" },
        link: "https://docs.merkl.xyz/",
        external: true,
        name: "Docs",
      },
      faq: {
        icon: { remix: "RiQuestionFill" },
        link: "/faq",
        name: "FAQ",
      },
      advanced: {
        icon: { remix: "RiSettings2Fill" },
        name: "Advanced",
        routes: {
          statistics: {
            icon: { remix: "RiDashboardFill" },
            name: "Statistics",
            link: "/statistics",
          },
          status: {
            icon: { remix: "RiPlanetFill" },
            name: "Status",
            link: "/statistics",
          },
          integrations: {
            icon: { remix: "RiFile4Fill" },
            name: "Integrations",
            link: "/integrations",
          },
        },
      },
    },
  },
  fonts: {
    italic: false,
  },
  opportunitiesFilters: {
    "rewards-asc": {
      name: "By Daily rewards",
    },
    "rewards-desc": {
      name: "By Daily rewards",
    },
    "apr-asc": {
      name: "By APR",
    },
    "apr-desc": {
      name: "By APR",
    },
    "tvl-asc": {
      name: "By TVL",
    },
    "tvl-desc": {
      name: "By TVL",
    },
  },
  opportunityNavigationMode: "supply",
  tokenSymbolPriority: ["ZK", "USDC", "USDC.e", "ETH", "WETH", "WBTC", "wstETH", "USDT", "USDe", "weETH", "DAI"],
  rewardsNavigationMode: "chain",
  opportunityLibrary: {
    defaultView: "cells",
    // views: ["table"], // If you want only one view, this is where you can specify it.
    excludeFilters: ["protocol", "tvl"],
  },
  opportunityPercentage: true,
  hideLayerMenuHomePage: false,
  supplyCredits: [],
  hero: {
    bannerOnAllPages: false, // show banner on all pages
    invertColors: false, // Light mode: light text on dark background (instead of dark text on light background)
  },
  images: {},
  deposit: true,
  walletOptions: {
    hideInjectedWallets: [],
    sponsorTransactions: true,
    async client(c) {
      if (c.chain?.id === zksync.id) return c.extend(eip712WalletActions());
      return c;
    },
  },

  chains: [],
  opportunity: {
    featured: {
      enabled: false,
      length: 6,
    },
    library: {
      sortedBy: "rewards",
      dailyRewardsTokenAddress: "",
      columns: { action: { enabled: false } },
    },
    minWalletBalance: 100,
  },
  bridge: {
    helperLink: "",
  },
  dashboard: {
    liquidityTab: {
      enabled: false,
    },
    reinvestTokenAddress: "",
  },
  tagsDetails: {
    token: {
      visitOpportunities: {
        enabled: true,
      },
    },
  },
  decimalFormat: {
    dollar: "$0,0.##a",
    apr: "0.##%a",
    point: "0.00##a",
  },
  socials: {
    discord: "",
    telegram: "https://t.me/+2T0RNabX2ANkMzAx",
    x: "https://x.com/zksyncignite",
    github: "",
  },
  links: {
    docs: "https://docs.merkl.xyz/",
    merkl: "https://merkl.xyz/",
    merklTermsConditions: "https://app.merkl.xyz/merklTerms.pdf",
    merklPrivacy: "https://privacy.angle.money",
  },
  footerLinks: [],
  wagmi: {
    chains: [
      mainnet,
      optimism,
      rootstock,
      bsc,
      lisk,
      gnosis,
      thunderCore,
      fuse,
      polygon,
      manta,
      xLayer,
      fantom,
      fraxtal,
      filecoin,
      etherlink,
      zksync,
      worldchain,
      astar,
      polygonZkEvm,
      coreDao,
      moonbeam,
      sei,
      astarZkEVM,
      mantle,
      base,
      immutableZkEvm,
      mode,
      arbitrum,
      avalanche,
      linea,
      bob,
      blast,
      taiko,
      scroll,
    ],
    client({ chain }) {
      if (chain.id === zksync.id)
        return createClient({
          chain,
          transport: custom(window.ethereum!),
        }).extend(eip712WalletActions());
      return createClient({ chain, transport: http() });
    },
    ssr: true,
    connectors: [
      walletConnect({
        customStoragePrefix: "wagmi",
        projectId: "26c912aadd2132cd869a5edc00aeea0f",
        metadata: {
          name: "Merkl Lite",
          description: "Merkl Lite",
          url: "https://app.merkl.xyz",
          icons: [],
        },
      }),
    ],
  },
};
