import { api } from "@core/api";
import RootErrorBoundary from "@core/error";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import type { MerklConfigBuilded } from "@core/modules/config/config.model";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import useMixpanel from "@core/modules/mixpanel/hooks/useMixpanel";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { Protocol } from "@merkl/api";
import type { PropsWithChildren } from "react";
import { Links, type LoaderFunctionArgs, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import AppProviders from "./providers";
import type { ServerContext } from "./server";

/**
 * Root Loader
 * @notice This function is the common root loader for all app to use.
 * @returns The global data for the application.
 */
export async function rootLoader({
  context: { backend, routes, version },
  request,
}: LoaderFunctionArgs<ServerContext>) {
  const chains = await ChainService({ api: api, backend, request }).getAll();
  const protocols = await ProtocolService({ api, backend }).get({ items: 500 });

  // Chains are essential to be able to use the app.
  if (!chains) throw new Response("Unable to fetch chains", { status: 500 });

  return {
    ENV: {
      API_URL: process.env.API_URL,
      MERKL_VERSION: version,
      BACKOFFICE_SECRET: process.env?.BACKOFFICE_SECRET ?? undefined,
    },
    chains,
    protocols,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const RootApp = (config: MerklConfigBuilded) => () => {
  const data = useLoaderData<typeof rootLoader>();

  useMixpanel(config.mixpanel?.token);

  return (
    <AppProviders env={data.ENV} config={config} protocols={data.protocols as Protocol[]} chains={data.chains}>
      <Outlet />
    </AppProviders>
  );
};

export const ErrorBoundary = (config: MerklConfigBuilded) => RootErrorBoundary(config);

export default {
  loader: rootLoader,
  meta: MetadataService({}).forwardMetadata<typeof rootLoader>(),
  clientLoader: Cache.wrap("root", 300),
  Layout: RootLayout,
  Error: ErrorBoundary,
  App: RootApp,
};
