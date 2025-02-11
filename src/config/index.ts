import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
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
//@ts-ignore
import merklClientConfig from "../../../../../merkl.config";
import { type MerklConfig, createConfig } from "./type";

const defaultMerklConfig: MerklConfig<Themes> = {
  appName: "Merkl",
  modes: ["dark", "light"],
  defaultTheme: "merkl",
  metaDatasGlobal: url => [
    {
      property: "og:image:alt",
      content: "Welcome to Merkl!",
    },
    {
      property: "twitter:site",
      content: "@Merkl",
    },
    {
      property: "twitter:creator",
      content: "@Merkl",
    },
    {
      property: "twitter:title",
      content: "Merkl",
    },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:image:type",
      content: "image/jpeg",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
  ],
  metaDatas: {
    home: (url, config) => [
      { title: `${config?.appName}` },
      { property: "description", content: "" },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    opportunities: (url, config) => [
      { title: `${config?.appName} | Opportunities` },
      {
        property: "description",
        content: `Add liquidity to our top DeFi DEX, lending and perp protocols, and earn ${config.clientTokenName}`,
      },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    opportunity: (url, config, opportunity) => [
      { title: `${config?.appName} | ${opportunity?.name}` },
      { property: "description", content: OpportunityService.getDescription(opportunity) || "" },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    dashboard: (url, config, address) => [
      {
        property: "title",
        content: `${config?.appName} | ${address?.substring(0, 6)}…${address.substring(address.length - 4)} dashboard`,
      },
      { property: "description", content: "" },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    chains: (url, config) => [
      { title: `${config?.appName} | Chains` },
      { property: "description", content: `Chains integrated by ${config?.appName}` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    chain: (url, config, chain) => [
      { title: `${config?.appName} | ${chain.name}` },
      { property: "description", content: `Earn rewards by supplying liquidity on ${chain.name} chain` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    bridge: (url, config) => [
      { title: `${config?.appName} | Bridge` },
      { property: "description", content: "Bridge" },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    protocols: (url, config) => [
      { title: `${config?.appName} | Protocols` },
      { property: "description", content: `Explore protocols incentivized on ${config?.appName}` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    protocol: (url, config, protocol) => [
      { title: `${config?.appName} | ${protocol.name}` },
      { property: "description", content: `Explore all opportunities availables on the ${protocol?.name} protocol` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    tokens: (url, config) => [
      { title: `${config?.appName} | Tokens` },
      { property: "description", content: `Tokens indexed by ${config?.appName}` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    token: (url, config, token) => [
      { title: `${config?.appName} | ${token?.symbol}` },
      { property: "description", content: `All opportunities availables on the ${token?.symbol} token` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    "opportunity/leaderboard": (url, config) => [
      { title: `${config?.appName} | Leaderboard per token` },
      { property: "description", content: "" },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
    faq: (url, config) => [
      { title: `${config?.appName} | FAQ` },
      { property: "description", content: `Welcome to ${config?.appName}!` },
      {
        property: "og:image",
        content: `${url}/preview.jpg`,
      },
    ],
  },
  fonts: { italic: false },
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
  },
  themes: {
    merkl: {
      base: createColoring(["#1755F4", "#FF7900", "#0D1530"], ["#1755F4", "#FF7900", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
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
      enabled: true,
      inHeader: false,
      key: uuidv4(),
    },
    opportunities: {
      icon: "RiPlanetFill",
      route: "/opportunities",
      enabled: true,
      inHeader: true,
      key: uuidv4(),
    },
    protocols: {
      icon: "RiVipCrown2Fill",
      route: "/protocols",
      enabled: true,
      inHeader: true,
      key: uuidv4(),
    },
    bridge: {
      icon: "RiCompassesLine",
      route: "/bridge",
      enabled: true,
      inHeader: true,
      key: uuidv4(),
    },
    docs: {
      icon: "RiFile4Fill",
      route: "https://docs.merkl.xyz/",
      external: true,
      enabled: true,
      inHeader: true,
      key: uuidv4(),
    },
    faq: {
      icon: "RiQuestionFill",
      route: "/faq",
      enabled: true,
      inHeader: true,
      key: uuidv4(),
    },
  },
  header: {
    searchbar: {
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
