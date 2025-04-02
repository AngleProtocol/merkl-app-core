import { Cache } from "@core/modules/cache/cache.service";
import ChainLibrary from "@core/modules/chain/components/library/ChainLibrary";
import\b.*react-router";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";

// DEPRECATED
export async function loader(_args: LoaderFunctionArgs) {
  // const chains = await ChainService({ api, backend }).getAll();
  return { chains: [], count: 0 };
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
