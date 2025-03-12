import { defineModule } from "@merkl/conduit";
import type { DefineRouteFunction } from "@remix-run/dev/dist/config/routes";
import type { MetaDescriptor } from "@remix-run/react";
import { createConfig as createWagmiConfig } from "wagmi";
import type { MerklConfig } from "./config.model";
import { defaultMerklConfig } from "./merkl.default.config";
import type { MerklBackendConfig } from "./types/merklBackendConfig";
import type { MerklRoute, MerklRouteType, MerklRoutes, MerklRoutesConfig } from "./types/merklRoutesConfig";
import type { MerklThemeConfig } from "./types/merklThemeConfig";

export const ConfigService = defineModule<object>().create(() => {
  const property = (propertyName: string, content: string) => ({ property: propertyName, content });
  const routeDefinitionTools = {
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
        ["site", "creator", "title"].map(tag => ({
          name: `twitter:${tag}`,
          content: tag === "title" ? title : content,
        })),
    },
    resource: <T extends keyof MerklRouteType>(type: T, definition: MerklRoute<T>) =>
      ({ type, ...definition }) as unknown as MerklRoute,
  } as const satisfies {
    // biome-ignore lint/suspicious/noExplicitAny: needed
    meta: { [shortcut: string]: (...args: any) => MetaDescriptor | MetaDescriptor[] };
    resource: <T extends keyof MerklRouteType>(type: T, definition: MerklRoute<T>) => MerklRoute;
  };

  type Tool = typeof routeDefinitionTools;

  /**
   * Merkl Routes Configuration
   * @param
   * @returns
   */
  const defineRoutes = <T extends MerklRoutesConfig>(definition: (tools: Tool) => T) => {
    const { layout, ...other } = definition(routeDefinitionTools);

    return {
      routes: definition(routeDefinitionTools),
      /**
       * Converts route configuration into Remix-mounted routes
       */
      defineRoutes: (set: DefineRouteFunction) => {
        set(undefined, layout.file, () => {
          const register = (routes: MerklRoutes, parent: string) => {
            for (const [route, { file, routes: subroutes }] of Object.entries(routes)) {
              set([parent, route].every(r => r === "/") ? "/" : `${parent}${route}`, file, () => {
                subroutes && register(subroutes, route);
              });
            }
          };

          return register(other, "");
        });
      },
    };
  };

  const createConfig = ({ wagmi, ...config }: MerklConfig) => {
    const wagmiConfig = createWagmiConfig(wagmi);

    return { wagmi: wagmiConfig, ...config };
  };

  const defineBackend = (create: () => MerklBackendConfig) => create();
  const defineTheme = (create: () => MerklThemeConfig) => create();
  const defineConfig = (create: () => MerklConfig) => createConfig(Object.assign(defaultMerklConfig, create()));

  return {
    defineRoutes,
    defineBackend,
    defineTheme,
    defineConfig,
  };
});
