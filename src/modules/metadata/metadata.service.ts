import merklConfig from "@core/config";
import type { MerklRoute, MerklRouteType, MerklRoutes } from "@core/config/routes";
import type { MetaDescriptor } from "@remix-run/node";

export abstract class MetadataService {
  /**
   * Compare routes definition versus location
   * @param definitionRoute (i.e. "/chains/:id")
   * @param route (i.e. "/chains/ethereum")
   */
  static compareRoute(definitionRoute: string, route: string) {
    const paramAgnosticParentRoute = definitionRoute
      .toLowerCase()
      .replaceAll(/:[\w-]+(?=\/|$)/g, ":param")
      .split("/")
      .filter(r => r !== "");
    const paramIndexes = paramAgnosticParentRoute
      .map((r, index) => (r === ":param" ? index : undefined))
      .filter(r => r !== undefined);

    const paramAgnosticRoute = route
      .split("/")
      .filter(r => r !== "")
      .map((r, index) => (paramIndexes.includes(index) ? ":param" : r));

    return (
      paramAgnosticParentRoute.every((r, index) => r === paramAgnosticRoute[index]) &&
      paramAgnosticParentRoute.length === paramAgnosticRoute.length
    );
  }
  /**
   * Recursive route to find the matching routes amongst all subroutes
   * @param location to test url against
   * @param routes all
   * @returns an array from deepest to shallowest match.
   */
  static matchRoute(location: string, routes: MerklRoutes, parentRoute = "/"): MerklRoute[] {
    for (const [route, value] of Object.entries(routes)) {
      const matches = MetadataService.matchRoute(location, value.routes ?? {}, parentRoute + route);

      if (matches.length > 0) return matches.concat(value);
      if (MetadataService.compareRoute(parentRoute + route, location)) return [value];
    }
    return [];
  }

  /**
   * Removes duplicates according to array order (first is more important)
   */
  static deduplicate(metadatas: MetaDescriptor[][]) {
    return metadatas.reduce(
      (all, metadata) =>
        all.concat(
          metadata?.filter(
            // biome-ignore lint/suspicious/noExplicitAny: no need to collapse type
            (meta: any) =>
              ![
                "name",
                "property",
                "title",
                "og:image",
                "og:image:width",
                "og:image:height",
                "og:image:alt",
                "og:url",
              ].some(key => {
                if (!meta?.[key]) return false;
                if (
                  key === "title"
                    ? // biome-ignore lint/suspicious/noExplicitAny: no need to collapse type
                      !all.some((_m: any) => !_m?.[key])
                    : // biome-ignore lint/suspicious/noExplicitAny: no need to collapse type
                      !all.some((_m: any) => _m?.[key] === meta?.[key])
                )
                  return false;
                return true;
              }),
          ),
        ),
      [],
    );
  }

  /**
   * Detects recursive routes and computes its metadata
   * @param url raw base url (i.e. "https://app.merkl.xyz")
   * @param location pathname, (i.e. "/", "/protocols")
   * @param type of the resource to be provided {@link MerklRouteType}
   * @param resource resource provided
   * @returns deduplicated route context meta descriptors
   */
  static wrap<T extends keyof MerklRouteType | undefined>(
    url: string,
    location: string,
    type?: T,
    resource?: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
  ) {
    const routes = merklConfig.routes as MerklRoutes & { layout?: Omit<MerklRoute, "label"> };
    const matches = MetadataService.matchRoute(location, routes);
    const metadatas = matches.map(({ type: routeType, metadata }) => {
      if (!routeType) return metadata?.(url, merklConfig, undefined) ?? [];
      if (routeType === type) return metadata?.(url, merklConfig, resource) ?? [];
      return [];
    });
    const globalMetadata = routes.layout?.metadata?.(url, merklConfig, undefined) ?? [];

    return MetadataService.deduplicate(metadatas.concat([globalMetadata]));
  }

  /**
   * Shortcut for finding meta descriptors
   * @param property property name
   * @returns raw string property
   */
  static find<Property extends "description" | "title">(
    metadata: MetaDescriptor[],
    property: Property,
  ): string | undefined {
    switch (property) {
      case "description":
        // biome-ignore lint/suspicious/noExplicitAny: no need to collapse
        return (metadata.find((meta: any) => meta?.name === "description") as any)?.content;
      case "title":
        // biome-ignore lint/suspicious/noExplicitAny: no need to collapse
        return (metadata.find((meta: any) => !!meta?.title) as any)?.title;
      default:
        break;
    }
  }
}
