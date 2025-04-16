import { ConfigProvider, LoadingIndicator } from "@core/index.generated";
import type { MerklConfig } from "@core/modules/config/config.model";
import Mixpanel from "@core/modules/mixpanel/components/Mixpanel";
import type { Chain, Protocol } from "@merkl/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppProvider } from "packages/dappkit/src";
import type { ReactNode } from "react";

export type AppProvidersProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  env: any;
  config: MerklConfig;
  protocols?: Protocol[];
  chains?: Chain[];
  children: ReactNode;
};

const queryClient = new QueryClient();

export default function AppProviders({ env, config, protocols, chains, children }: AppProvidersProps) {
  return (
    <ConfigProvider config={config} protocols={(protocols as Protocol[]) ?? []}>
      <QueryClientProvider client={queryClient}>
        <DAppProvider
          walletOptions={config.walletOptions}
          chains={chains ?? []}
          modes={config.theme.modes}
          themes={config.theme.themes}
          sizing={config.theme.sizing}
          config={config.wagmi}>
          <LoadingIndicator />
          {children}
          <Mixpanel />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-1TSSVRH2ZV" />
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for browser ENV
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)};

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
}
