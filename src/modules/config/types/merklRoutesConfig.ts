import type { MerklBackendConfig } from "@core/modules/config/types/merklBackendConfig";
import type { Chain, Opportunity, Protocol, Token } from "@merkl/api";
import type { MetaDescriptor } from "react-router";

/**
 * Types of single page resources
 * @description requited for display title of chain for example
 */
export type MerklRouteType = {
  token: Token;
  opportunity: Opportunity;
  chain: Chain;
  protocol: Protocol;
  user: { address: string };
};

export type MerklRoute<T extends keyof MerklRouteType | undefined = keyof MerklRouteType | undefined> = {
  /**
   * Label for links across the app
   */
  label: string;
  route?: string;
  type?: T;
  /**
   * Meta Tags
   * @notice they will be merged with the default ones
   * @param url (i.e. https://app.merkl.xyz), useful to get public links
   * @param config currently used config
   * @param resource dependency for resource pages
   * @returns
   */
  metadata?: (
    url: string,
    config: MerklBackendConfig,
    resource: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
  ) => MetaDescriptor[];
  /**
   * Page title/description to use instead of metadatas
   */
  pagedata?: (
    url: string,
    config: MerklBackendConfig,
    resource: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
  ) => MetaDescriptor[];
  /**
   * Remix route file containing Index, loader, action...
   */
  file: string;
  /**
   * Recursive entry for subroutes
   * {@link MerklRoutes}
   */
  routes?: MerklRoutes;
};

/**
 * Route entry in the links menu, either an external link or internal route
 */
export type MerklRoutes = {
  [url: `/${string}`]: MerklRoute;
};

export type MerklRoutesConfig = MerklRoutes & { layout: Omit<MerklRoute, "label"> };
