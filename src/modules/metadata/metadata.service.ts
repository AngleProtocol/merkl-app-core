import { defineModule } from "@merkl/conduit";
import type { LoaderFunctionArgs, MetaDescriptor, MetaFunction } from "@remix-run/node";
import type { Location } from "@remix-run/react";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";
import type { MerklRoute, MerklRouteType, MerklRoutes } from "../config/types/merklRoutesConfig";

type Dependencies = {
  routes: MerklRoutes;
  backend: MerklBackendConfig;
  url: string;
  request: Request;
  location: Location;
};

export const MetadataService = defineModule<Dependencies>().create(({ inject }) => {
  /**
   * Compare routes definition versus location
   * @param definitionRoute (i.e. "/chains/:id")
   * @param route (i.e. "/chains/ethereum")
   */
  const compareRoute = (definitionRoute: string, route: string) => {
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
  };

  /**
   * Recursive route to find the matching routes amongst all subroutes
   * @param location to test url against
   * @param routes all
   * @returns an array from deepest to shallowest match.
   */
  const matchRoute = inject(["location"]).inFunction(
    ({ location }, routes: MerklRoutes, parentRoute = "/"): MerklRoute[] => {
      for (const [route, value] of Object.entries(routes)) {
        const matches = matchRoute.handler({ location }, value.routes ?? {}, parentRoute + route);
        const valueWithRoute = { ...value, route };

        if (matches.length > 0) return matches.concat(valueWithRoute);
        if (compareRoute(parentRoute + route, location.pathname)) return [valueWithRoute];
      }
      return [];
    },
  );

  /**
   * Recursive route to find the matching routes amongst all subroutes
   * @param location to test url against
   * @param routes all
   * @returns an array from deepest to shallowest match.
   */
  const findAbstractRoute = inject(["location"]).inFunction(
    (
      { location },
      routes: MerklRoutes,
      parentRoute = "/",
    ): { path: string; route: string; label: string; fullLabel: string } => {
      const matches = matchRoute?.handler({ location }, routes, parentRoute);
      let joint = matches
        .reverse()
        .map(({ route }) => route)
        .join("/");

      const replacements = ["//", "///", "////"].reverse();
      for (let i = 0; i < replacements.length; i++) joint = joint.replaceAll(replacements[i], "/");

      return {
        route: joint,
        path: location.pathname,
        fullLabel: matches
          .map(({ label }) => label)
          .join("/")
          .toLowerCase(),
        label: matches?.[0]?.label?.toLowerCase(),
      };
    },
  );

  const deduplicate = (metadatas: MetaDescriptor[][]) => {
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
  };

  /**
   * Detects recursive routes and computes its metadata
   * @param url raw base url (i.e. "https://app.merkl.xyz")
   * @param location pathname, (i.e. "/", "/protocols")
   * @param type of the resource to be provided {@link MerklRouteType}
   * @param resource resource provided
   * @returns deduplicated route context meta descriptors
   */
  const baseWrap = inject(["routes", "backend", "url", "location"]).inFunction(
    <T extends keyof MerklRouteType | undefined>(
      deps: { routes: MerklRoutes; backend: MerklBackendConfig; location: Location; url: string },
      key: "metadata" | "pagedata",
      type?: T,
      resource?: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
    ) => {
      const routes = deps.routes as MerklRoutes & { layout?: Omit<MerklRoute, "label"> };

      const matches = matchRoute.handler(deps, routes);
      const metadatas = matches.map(({ type: routeType, metadata, pagedata }) => {
        const pageOrMetaData = { metadata, pagedata }[key];
        if (!routeType) return pageOrMetaData?.(deps.url, deps.backend, undefined) ?? [];
        if (routeType === type) return pageOrMetaData?.(deps.url, deps.backend, resource) ?? [];
        return [];
      });
      const globalMetadata = routes.layout?.metadata?.(deps.url, deps.backend, undefined) ?? [];

      return deduplicate(metadatas.concat([globalMetadata]));
    },
  );

  const wrap = inject(["backend", "routes", "url", "location"]).inFunction(
    <T extends keyof MerklRouteType | undefined>(
      deps: { routes: MerklRoutes; backend: MerklBackendConfig; location: Location; url: string },
      type?: T,
      resource?: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
    ) => {
      return baseWrap.handler(deps, "metadata", type, resource);
    },
  );

  const wrapInPage = inject(["backend", "routes", "url", "location"]).inFunction(
    <T extends keyof MerklRouteType | undefined>(
      deps: { routes: MerklRoutes; backend: MerklBackendConfig; location: Location; url: string },
      type?: T,
      resource?: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
    ) => {
      const meta = baseWrap.handler(deps, "metadata", type, resource);
      const page = baseWrap.handler(deps, "pagedata", type, resource);

      return deduplicate([page, meta]);
    },
  );

  /**
   * Shortcut for finding meta descriptors
   * @param property property name
   * @returns raw string property
   */
  const find = <Property extends "description" | "title">(
    metadata: MetaDescriptor[],
    property: Property,
  ): string | undefined => {
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
  };

  const fromRoute = (
    data: { backend: MerklBackendConfig; routes: MerklRoutes; url: string } | undefined,
    error: unknown,
    location: Location,
  ) => {
    if (error) return { wrap: () => [{ title: error }] };
    if (!data) return { wrap: () => [{ title: error }] };
    const { url, backend, routes } = data;

    return MetadataService({ url, backend: backend as MerklBackendConfig, routes, location });
  };

  const fill = inject(["backend", "request", "routes"]).inFunction(
    <T extends keyof MerklRouteType | undefined>(
      dependencies: Pick<Dependencies, "backend" | "request" | "routes">,
      type?: T,
      resource?: T extends keyof MerklRouteType ? MerklRouteType[T] : undefined,
    ) => {
      const { request } = dependencies;
      const url = `${request.url.split("/")?.[0]}//${request.headers.get("host")}`;
      const metadata = wrap.handler(
        {
          ...dependencies,
          url,
          location: {
            pathname: request.url.replace(url, ""),
            key: "",
            search: "",
            hash: "",
            state: "",
          },
        },
        type,
        resource,
      );

      return {
        url,
        metadata,
      };
    },
  );

  type MetadataLoader = (args: LoaderFunctionArgs) => Promise<{
    url: string;
    metadata: MetaDescriptor[];
  }>;
  const forwardMetadata: <Loader extends MetadataLoader>() => MetaFunction<Loader> = () => data =>
    data.data?.metadata ?? [];

  return {
    find,
    wrapInPage,
    wrap,
    fromRoute,
    fill,
    forwardMetadata,
    findAbstractRoute,
  };
});
