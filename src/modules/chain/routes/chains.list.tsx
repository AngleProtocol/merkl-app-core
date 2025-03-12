import { api } from "@core/api";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import ChainLibrary from "@core/modules/chain/components/library/ChainLibrary";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService({ api }).getAll();
  return { chains, count: chains.length };
}

export const clientLoader = Cache.wrap("chains", 300);

export default function Index() {
  const { chains, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <ChainLibrary chains={chains} count={count} />
    </Container>
  );
}
