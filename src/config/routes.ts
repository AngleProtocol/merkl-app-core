import type { Chain, Opportunity, Protocol, Token } from "@merkl/api";
import type { DefineRouteFunction } from "@remix-run/dev/dist/config/routes";
import type { MetaDescriptor } from "@remix-run/node";
import type { NavigationMenuRoute } from "./type";
import type { MerklBackend } from "./backend";

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
    config: MerklBackend,
    resource: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
  ) => MetaDescriptor[];
  /**
   * Page title/description to use instead of metadatas
   */
  pagedata?: (
    url: string,
    config: MerklBackend,
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

/**
 * Collection of routes
 * {@link NavigationMenuRoute }
 */
export type NavigationMenuRoutes = {
  [key: string]: NavigationMenuRoute;
};

const property = (propertyName: string, content: string) => ({ property: propertyName, content });
const tools = {
  /**
   * Shortcuts for defining meta descriptors
   */
  meta: {
    siteName: (site: string) => [property("og:site_name", site)],
    title: (title: string) => [{ title }, property("og:title", title)],
    description: (content: string) => [{ name: "description", content }, property("og:description", content)],
    keywords: (content: string) => ({ name: "keywords", content }),
    preview: (content: string, type: "image/jpeg" | "image/png", width: number, height: number, alt: string) => [
      property("og:image", content),
      property("og:type", type),
      property("og:image:width", width.toString()),
      property("og:image:height", height.toString()),
      property("og:image:alt", alt),
    ],
    url: (content: string) => property("og:url", content),
    twitter: (content: `@${string}`, title: string) =>
      ["site", "creator", "title"].map(tag => ({ name: `twitter:${tag}`, content: tag === "title" ? title : content })),
  },
  resource: <T extends keyof MerklRouteType>(type: T, definition: MerklRoute<T>) =>
    ({ type, ...definition }) as unknown as MerklRoute,
} as const satisfies {
  // biome-ignore lint/suspicious/noExplicitAny: needed
  meta: { [shortcut: string]: (...args: any) => MetaDescriptor | MetaDescriptor[] };
  resource: <T extends keyof MerklRouteType>(type: T, definition: MerklRoute<T>) => MerklRoute;
};

export type Tool = typeof tools;

/**
 * Types object routes and allows for mutation logic
 * @returns remix manual route configuration
 */
export const merklRoutes = <T extends MerklRoutes & { layout: Omit<MerklRoute, "label"> }>(
  definition: (tools: Tool) => T,
) => {
  const { layout, ...other } = definition(tools);

  return {
    routes: definition(tools),
    /**
     * Converts route configuration into Remix-mounted routes
     */
    defineRoutes: (set: DefineRouteFunction) => {
      set(undefined, layout.file, () => {
        const register = (routes: MerklRoutes, parent: string) => {
          for (const [route, { file, routes: subroutes }] of Object.entries(routes)) {
            set([parent, route].every(r => r === "/") ? "/" : `${parent}${route}`, file, () => {
              subroutes && register(subroutes, `${parent}${route}`);
            });
          }
        };

        return register(other, "");
      });
    },
  };
};
