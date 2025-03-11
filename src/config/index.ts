import Brand from "@core/components/layout/Brand";
import { type Themes, createColoring } from "dappkit";
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
//TODO: find a better way to handle importing the client config, this works
//@ts-ignore
import merklClientConfig from "../../../../../merkl.config";
import { type MerklConfig, createConfig } from "./type";

export const defaultMerklConfig: MerklConfig<Themes> = {
  appName: "Merkl",
  modes: ["dark", "light"],
  defaultTheme: "merkl",
  navigation: {
    brand: Brand,
    header: {
      dashboard: {
        icon: { remix: "RiDashboardFill" },
        link: "/users/:address",
        flags: { replaceWithWallet: ":address" },
        name: "Claims",
      },
      opportunities: {
        icon: { remix: "RiPlanetFill" },
        link: "/",
        name: "Opportunities",
      },
      faq: {
        icon: { remix: "RiPlanetFill" },
        link: "/faq",
        name: "FAQ",
      },
      referral: {
        icon: { remix: "RiPlanetFill" },
        link: "/referral",
        name: "Referral",
      },
    },
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
    hideInjectedWallets: ["phantom", "coinbase wallet"],
    sponsorTransactions: true,
    async client(c) {
      if (c.chain?.id === zksync.id) return c.extend(eip712WalletActions());
      return c;
    },
  },
  chains: [],
  opportunity: {
    enabled: false,
    length: 6,
    library: {
      sortedBy: "rewards",
      dailyRewardsTokenAddress: "",
      columns: { enabled: false },
      minWalletBalance: 100,
    },
    bridge: {
      helperLink: "",
    },
    dashboard: {
      enabled: false,
      reinvestTokenAddress: "",
    },
    tagsDetails: {
      enabled: true,
    },
    decimalFormat: {
      dollar: "$0,0.##a",
      apr: "0.##%a",
    },
    themes: {
      merkl: {
        base: createColoring(["#7653FF", "#6C78A9", "#141313"], ["#7653FF", "#6C78A9", "#FFFFFF"]),
        info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        good: createColoring(["#41D5BB", "#8FF2E1", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      },
      ignite: {
        base: createColoring(["#1755F4", "#FF7900", "#0D1530"], ["#1755F4", "#FF7900", "#FFFFFF"]),
        info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
        harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      },
    },
    sizing: {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
    },
    spacing: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 },
    radius: { xs: 3, sm: 6, md: 9, lg: 12, xl: 15 },
  },
  alwaysShowTestTokens: true,
  showCopyOpportunityIdToClipboard: true,
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

const merklConfig = createConfig(Object.assign(defaultMerklConfig, merklClientConfig));

export default merklConfig;
