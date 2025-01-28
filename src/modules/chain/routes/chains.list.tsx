import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import ChainLibrary from "@core/modules/chain/components/library/ChainLibrary";
import useChains from "@core/modules/chain/hooks/useChains";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { useEffect } from "react";

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();
  return { chains, count: chains.length };
}

export const clientLoader = Cache.wrap("chains", 300);

export default function Index() {
  const { chains, count } = useLoaderData<typeof loader>();
  const { isSingleChain } = useChains(chains);
  const navigate = useNavigate();

  // TODO: need to be refacto when we refactor the custom router
  useEffect(() => {
    if (!isSingleChain) return;
    navigate("/");
  }, [isSingleChain, navigate]);

  return (
    <Container>
      <Space size="xl" />
      <ChainLibrary chains={chains} count={count} />
    </Container>
  );
}
