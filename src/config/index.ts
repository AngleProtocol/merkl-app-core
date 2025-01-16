import { type Themes, createColoring } from "dappkit";
import { v4 as uuidv4 } from "uuid";
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
import merklClientConfig from "../../../../../merkl.config";
import { type MerklConfig, createConfig } from "./type";

//TODO: import default config
const defaultMerklConfig: MerklConfig<Themes> = {
  appName: "Merkl",
  modes: ["dark", "light"],
  defaultTheme: "ignite",
  opportunityNavigationMode: "supply",
  tokenSymbolPriority: ["ZK", "USDC", "USDC.e", "ETH", "WETH", "WBTC", "wstETH", "USDT", "USDe", "weETH", "DAI"],
  rewardsNavigationMode: "chain",
  opportunityLibrary: {
    defaultView: "cells",
    // views: ["table"], // If you want only one view, this is where you can specify it.
    cells: {
      hideTags: ["token", "action"],
    },
    excludeFilters: ["protocol", "tvl"],
  },
  opportunityPercentage: true,
  hideLayerMenuHomePage: false,
  supplyCredits: [],
  hero: {
    bannerOnAllPages: false, // show banner on all pages
    invertColors: false, // Light mode: light text on dark background (instead of dark text on light background)
  },
  opportunityFilters: {
    minimumTVL: false,
    protocols: false,
    displaySelector: false,
  },
  deposit: true,
  walletOptions: {
    hideInjectedWallets: ["phantom", "coinbase wallet"],
    sponsorTransactions: true,
    client(c) {
      if (c.chain?.id === zksync.id) return c.extend(eip712WalletActions());
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
      columns: {
        action: {
          enabled: false,
        },
      },
    },
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
  },
  themes: {
    ignite: {
      base: createColoring(["#1755F4", "#FF7900", "#0D1530"], ["#1755F4", "#FF7900", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    merkl: {
      base: createColoring(["#1755F4", "#FF7900", "#0D1530"], ["#1755F4", "#FF7900", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    backoffice: {
      base: createColoring(["#8B8D98", "#9984D2", "#000000"], ["#8B8D98", "#9984D2", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    puffer: {
      base: createColoring(["#2A35BD", "#BFFF38", "#FFFFFF"], ["#2A35BD", "#BFFF38", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
  },
  sizing: {
    width: { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 },
    spacing: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 },
    radius: { xs: 3, sm: 6, md: 9, lg: 12, xl: 15 },
  },
  alwaysShowTestTokens: true,
  showCopyOpportunityIdToClipboard: true,
  routes: {
    home: {
      icon: "RiHomeFill",
      route: "/",
      key: uuidv4(),
    },
    opportunities: {
      icon: "RiPlanetFill",
      route: "/opportunities",
      key: uuidv4(),
    },
    protocols: {
      icon: "RiVipCrown2Fill",
      route: "/protocols",
      key: uuidv4(),
    },
    bridge: {
      icon: "RiCompassesLine",
      route: "/bridge",
      key: uuidv4(),
    },
    docs: {
      icon: "RiFile4Fill",
      external: true,
      route: "https://docs.merkl.xyz/",
      key: uuidv4(),
    },
    faq: {
      icon: "RiQuestionFill",
      route: "/faq",
      key: uuidv4(),
    },
    // terms: {
    //   icon: "RiCompassesLine",
    //   route: "/terms",
    //   key: uuidv4(),
    // },
    // privacy: {
    //   icon: "RiInformationFill",
    //   route: "/privacy",
    //   key: uuidv4(),
    // },
  },
  header: {
    searchbar: {
      enabled: true,
    },
    opportunities: {
      enabled: false,
    },
    bridge: {
      enabled: true,
    },
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

const merklConfig = createConfig(Object.assign(defaultMerklConfig, merklClientConfig));

export default merklConfig;
