import { api } from "@core/api";
import RootErrorBoundary from "@core/error";
import { LoadingIndicator } from "@core/index.generated";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { ConfigProvider } from "@core/modules/config/config.context";
import type { MerklConfig } from "@core/modules/config/config.model";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import Mixpanel from "@core/modules/mixpanel/components/Mixpanel";
import useMixpanel from "@core/modules/mixpanel/hooks/useMixpanel";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { Protocol } from "@merkl/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppProvider } from "dappkit";
import type { PropsWithChildren } from "react";
import { Links, type LoaderFunctionArgs, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
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
    ENV: { API_URL: process.env.API_URL, MERKL_VERSION: version },
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

const queryClient = new QueryClient();

export const RootApp = (config: MerklConfig) => () => {
  const data = useLoaderData<typeof rootLoader>();

  useMixpanel(config.mixpanel?.token);

  return (
    <ConfigProvider config={config} protocols={data.protocols as Protocol[]}>
      <QueryClientProvider client={queryClient}>
        <DAppProvider
          walletOptions={config.walletOptions}
          chains={data.chains}
          modes={config.theme.modes}
          themes={config.theme.themes}
          sizing={config.theme.sizing}
          config={config.wagmi}>
          <LoadingIndicator />
          <Outlet />
          <Mixpanel />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-1TSSVRH2ZV" />
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for browser ENV
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data?.ENV)};

            // Google Analytics
             window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1TSSVRH2ZV');
            `,
            }}
          />
        </DAppProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export const ErrorBoundary = (config: MerklConfig) => RootErrorBoundary(config);

export default {
  loader: rootLoader,
  meta: MetadataService({}).forwardMetadata<typeof rootLoader>(),
  clientLoader: Cache.wrap("root", 300),
  Layout: RootLayout,
  Error: ErrorBoundary,
  App: RootApp,
};
