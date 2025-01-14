import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppProvider, Group, Icon, Text, Title } from "dappkit";
import { useEffect } from "react";
import config from "../merkl.config";
import dappkitStyles from "../packages/dappkit/src/style.css?url";
import LoadingIndicator from "./components/layout/LoadingIndicator";
import styles from "./index.css?url";
import { Cache } from "./modules/cache/cache.service";
import { ChainService } from "./modules/chain/chain.service";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: dappkitStyles,
    as: "style",
  },
  {
    rel: "stylesheet",
    href: styles,
    as: "style",
  },
];

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();

  if (!chains) throw new Response("Unable to fetch chains", { status: 500 });

  return json({ ENV: { API_URL: process.env.API_URL }, chains });
}

export const clientLoader = Cache.wrap("root", 300);
const queryClient = new QueryClient();

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <QueryClientProvider client={queryClient}>
      <DAppProvider
        walletOptions={config.walletOptions}
        chains={data.chains}
        modes={config.modes}
        themes={config.themes}
        sizing={config.sizing}
        config={config.wagmi}>
        <LoadingIndicator />
        <Outlet />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for browser ENV
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
      </DAppProvider>
    </QueryClientProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
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

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const notARoute = isRouteErrorResponse(error) && error.status === 404;
  console.error(error);

  useEffect(() => {
    if (isRouteErrorResponse(error) && error.status === 404) return navigate("/");
  }, [error, navigate]);

  if (notARoute)
    return (
      <QueryClientProvider client={queryClient}>
        <DAppProvider
          chains={[]}
          modes={config.modes}
          themes={config.themes}
          sizing={config.sizing}
          config={config.wagmi}>
          <Group className="h-[100vh] flex-col justify-center m-auto w-min">
            <Title h={1} className="flex flex-nowrap flex-col">
              <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
              Invalid Url
            </Title>
            <Text className="text-center w-full">Redirecting...</Text>
          </Group>
        </DAppProvider>
      </QueryClientProvider>
    );
  return (
    <QueryClientProvider client={queryClient}>
      <DAppProvider
        chains={[]}
        modes={config.modes}
        themes={config.themes}
        sizing={config.sizing}
        config={config.wagmi}>
        <Group className="h-[100vh] flex-col justify-center m-auto w-min">
          <Title h={1} className="flex flex-nowrap flex-col">
            <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
            An Error occured
          </Title>
          <Text className="text-center">Please wait until the issue is resolved</Text>
        </Group>
      </DAppProvider>
    </QueryClientProvider>
  );
}
