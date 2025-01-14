import type * as RemixIcon from "@remixicon/react";
import type { Mode, Themes, sizeScale } from "dappkit";
import type { WalletOptions } from "packages/dappkit/src/hooks/useWalletState";
import type { TagTypes } from "src/components/element/Tag";
import type { OpportunityFilter } from "src/components/element/opportunity/OpportunityFilters";
import type { Chain } from "viem";
import { createConfig as createWagmiConfig } from "wagmi";
import type { OpportunityNavigationMode, OpportunitySortedBy, OpportunityView } from "./opportunity";
import type { RewardsNavigationMode } from "./rewards";

export type routesType = {
  [key: string]: {
    route: string;
    icon: keyof typeof RemixIcon;
    key: string;
    external?: boolean;
  };
};

// TODO: groups by entity
export type MerklConfig<T extends Themes> = {
  themes: T;
  sizing: {
    width: { [Size in (typeof sizeScale)[number]]: number };
    spacing: { [Size in (typeof sizeScale)[number]]: number };
    radius: { [Size in (typeof sizeScale)[number]]: number };
  };
  tags?: string[];
  defaultTheme: keyof T;
  deposit?: boolean;
  chains?: Chain[];
  alwaysShowTestTokens?: boolean;
  showCopyOpportunityIdToClipboard?: boolean;
  walletOptions?: WalletOptions;
  tokenSymbolPriority: string[];
  opportunityNavigationMode?: OpportunityNavigationMode;
  rewardsNavigationMode?: RewardsNavigationMode;
  rewardsTotalClaimableMode?: string; // Address of the token you want to display the totals of
  dashboardPageName?: string; // Name of the dashboard page
  opportunityPercentage: boolean;
  hideLayerMenuHomePage: boolean;
  hideInteractor?: boolean; // Whether the interactor with a given opportunity must be displayed or not
  hideBridgePage?: boolean; // Whether the bridge page should be added or not
  hideSpyMode?: boolean;
  supplyCredits: {
    id: string;
    name: string;
    image: string;
    url: string;
  }[];
  modes: Mode[];
  wagmi: Parameters<typeof createWagmiConfig>["0"];
  appName: string;
  fonts?: { title: string[]; text: string[]; mono: string[] };
  routes: routesType;
  opportunity: {
    featured: {
      enabled: boolean;
      length: number;
    };
    library: {
      sortedBy: OpportunitySortedBy;
      dailyRewardsTokenAddress: string;
      columns: {
        action: {
          enabled: boolean;
        };
      };
    };
  };
  opportunityLibrary: {
    defaultView?: OpportunityView;
    views?: OpportunityView[];
    cells?: {
      hideTags?: (keyof TagTypes)[];
    };
    excludeFilters?: OpportunityFilter[];
  };
  bridge: {
    helperLink?: string;
  };
  dashboard: {
    liquidityTab: {
      enabled: boolean;
    };
  };
  tagsDetails: {
    token: {
      visitOpportunities: {
        enabled: boolean;
      };
    };
  };
  decimalFormat: {
    dollar: string;
  };
  hero: {
    bannerOnAllPages: boolean; // show banner on all pages
    invertColors: boolean; // Light mode: light text on dark background (instead of dark text on light background)
  };
  header: {
    searchbar: {
      enabled: boolean;
    };
    opportunities: {
      enabled: boolean;
    };
    bridge: {
      enabled: boolean;
    };
  };
  images: {
    [name: string]: string;
  };
  socials: {
    [key: string]: string;
  };
  links: {
    [key: string]: string;
  };
  footerLinks: { image: string; link: string; key: string }[];
};

export function createConfig<T extends Themes>({ wagmi, ...config }: MerklConfig<T>) {
  const wagmiConfig = createWagmiConfig(wagmi);

  return { wagmi: wagmiConfig, ...config };
}
