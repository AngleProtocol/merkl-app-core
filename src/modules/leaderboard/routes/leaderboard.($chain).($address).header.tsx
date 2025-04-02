import { api } from "@core/api";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { Outlet, useLoaderData } from "react-router";
import Hero from "../../../components/composite/Hero";
import { ErrorHeading } from "../../../components/layout/ErrorHeading";
import { ChainService } from "../../chain/chain.service";
import { TokenService } from "../../token/token.service";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({
  context: { backend, routes },
  params: { address, chain: chainName },
  request,
}: LoaderFunctionArgs) {
  if (!chainName && !backend.leaderboard) throw "";
  if (!chainName) chainName = backend.leaderboard!.chain;

  if (!address && !backend.leaderboard) throw "";
  if (!address) address = backend.leaderboard!.address;

  const chain = await ChainService({ api, backend, request }).get({ name: chainName });
  const token = await TokenService({ api }).findUniqueOrThrow(chain.id, address);

  return {
    token,
    chain,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { token } = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ src: token.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <>
          {token.name} <span className="font-mono text-main-8">({token.symbol})</span>
        </>
      }
      description={`Leaderboard of all ${token.symbol} rewards earned through Merkl`}>
      <Outlet />
    </Hero>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
