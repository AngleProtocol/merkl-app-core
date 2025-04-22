import type {
  OpportunityNavigationMode,
  OpportunityRowView,
  OpportunitySortedBy,
  OpportunityView,
} from "@core/config/opportunity";
import type { RewardsNavigationMode } from "@core/config/rewards";
import type { OpportunityFilter } from "@core/modules/opportunity/components/OpportunityFilters";
import type { IconProps, WalletOptions } from "packages/dappkit/src";
import type { Chain } from "viem";
import type { ResolvedRegister } from "wagmi";
import type { OpportuntyLibraryOverride } from "../opportunity/opportunity.model";
import type { MerklBackendConfig } from "./types/merklBackendConfig";
import type { MerklRoutes } from "./types/merklRoutesConfig";
import type { MerklThemeConfig } from "./types/merklThemeConfig";

/**
 * Route entry in the links menu, either an external link or internal route
 */
export type NavigationMenuRoute<L extends "link" | "menu" = "link" | "menu"> = {
  icon: IconProps;
  name: string;
} & (L extends "link"
  ? { link: string; flags?: { replaceWithWallet: string }; external?: boolean; disabled?: boolean }
  : { routes: NavigationMenuRoutes });

/**
 * Collection of routes
 * {@link NavigationMenuRoute }
 */
export type NavigationMenuRoutes = {
  [key: string]: NavigationMenuRoute;
};

// TODO: groups by entity
export type MerklConfig = {
  theme: MerklThemeConfig;
  routes: MerklRoutes;
  backend: MerklBackendConfig;
  mixpanel?: {
    token: string;
  };

  /**
   * Hide the price of reward tokens in the UI
   */
  hideRewardTokenPrice?: string[];

  /**
   * Filter resources like opportunities by their inherent tags
   */
  tags?: string[];

  /**
   * Filters enabled in the opportunities header list
   */
  opportunitiesFilters: Record<string, { name: string }>;
  /**
   * Navigation Menu and Header links configuration
   */
  navigation: {
    brand?: () => JSX.Element;
    header: NavigationMenuRoutes;
    addtionalHeaderLinks?: NavigationMenuRoutes;
    menu: NavigationMenuRoutes;
  };
  /**
   * Toggle supply modal allowing users to deposit/withdraw directly on opportunities
   */
  deposit?: boolean;
  /**
   * Allows to override the token name displayed in the supply modal for idle tokens
   */
  clientTokenName?: string;
  /**
   * Chains that can be connected to the dapp
   * @notice chains needs to be set in the wagmi config as well to allow wallets to connect
   */
  chains?: Chain[];
  protocols?: string[];
  referral?: {
    /**
     *
     */
    chainId: number;
    referralKey: string;
  };
  /**
   * Show opportunities & campaigns created with test tokens (aglaMerkl)
   */
  alwaysShowTestTokens?: boolean;

  walletOptions?: WalletOptions;
  /**
   * Provides a default order of to sort tokens when no balance or not connected
   */
  tokenSymbolPriority: string[];
  /**
   * Edits behavior of clicking on an opportunity from a list
   * @option "direct" - opens the opportunity full page
   * @option "supply" - opens the supply modal with a link to the full page & supply input if enabled
   */
  opportunityNavigationMode?: OpportunityNavigationMode;
  /**
   * Edits display of user rewards in the dashboard
   * @option "opportunity" - show rewards directly by opportunity (not by chains>tokens)
   * @option "direct" - groups rewards by chain & by token, then display opportunities
   */
  rewardsNavigationMode?: RewardsNavigationMode;
  /**
   * Specify a token to show rewards for when the app only handles one distributed token
   * @notice needs to be an address not a symbol
   */
  rewardsTotalClaimableMode?: string; // Address of the token you want to display the totals of
  /**
   * Name given to the "dashboard" page
   */
  dashboardPageName?: string; // Name of the dashboard page
  /**
   * Toggles pool fee in opportunity names such as "0.3%" in "Uniswap WETH-USDC 0.3%""
   */
  opportunityPercentage: boolean;
  /**
   * Toggles the navigation menu on the header's logo
   */
  hideLayerMenuHomePage: boolean;
  hideInteractor?: boolean; // Whether the interactor with a given opportunity must be displayed or not
  /**
   * Toggles the bridge page
   */
  hideBridgePage?: boolean;
  /**
   * Toggles ability to manually enter an address instead of connecting it
   */
  hideSpyMode?: boolean;
  /**
   * @deprecated should be returned from api dynamically instead
   */
  supplyCredits: {
    id: string;
    name: string;
    image: string;
    url: string;
  }[];
  /**
   * Enables themes to be switched between dark and light or enforce only one
   */
  wagmi: ResolvedRegister["config"];
  /**
   * Custom white-label-banner component to showup on the top of pages
   */
  customBanner?: React.ReactNode;
  /**
   * App name reflected in the app titles & descriptions
   */
  appName: string;
  fonts?: { italic?: boolean };
  opportunity: {
    featured: {
      enabled: boolean;
      length: number;
    };
    library: {
      sortedBy: OpportunitySortedBy;
      dailyRewardsTokenAddress: string;
      overrideDisplay?: OpportuntyLibraryOverride<"table">;
      overrideCell?: OpportuntyLibraryOverride<"cell">;
      columns: {
        action: {
          enabled: boolean;
        };
      };
    };
    // Minimum idle token balance to display the idle token modal for an opportunity
    minWalletBalance: number;
  };
  opportunityLibrary: {
    defaultView?: OpportunityView;
    views?: OpportunityView[];
    rowView?: OpportunityRowView;
    excludeFilters?: OpportunityFilter[];
  };
  bridge: {
    helperLink?: string;
  };
  dashboard: {
    liquidityTab: {
      enabled: boolean;
    };
    /**
     * Address of the token of user to reinvest in the dashboard
     */
    reinvestTokenAddress?: string;
  };
  tagsDetails: {
    token: {
      visitOpportunities: {
        enabled: boolean;
      };
    };
  };
  leaderboard?: {
    chain: string;
    address: string;
  };
  decimalFormat: {
    dollar: string;
    apr: string;
    point: string;
  };
  hero: {
    bannerOnAllPages: boolean; // show banner on all pages
    invertColors: boolean; // Light mode: light text on dark background (instead of dark text on light background)
  };
  header: {
    searchbar: {
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
