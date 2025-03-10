import { api } from "@core/api";
import { Cache } from "@core/modules/cache/cache.service";
import useChains from "@core/modules/chain/hooks/useChains";
import ProtocolLibrary from "@core/modules/protocol/components/library/ProtocolLibrary";
import { ProtocolService } from "@core/modules/protocol/protocol.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";

export async function loader({ context: { server }, request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService({ api, request, server }).getManyFromRequest();

  return { protocols, count };
}

export const clientLoader = Cache.wrap("protocols", 300);

export default function Index() {
  const { protocols, count } = useLoaderData<typeof loader>();
  const { chains } = useChains();

  return (
    <Container>
      <Space size="xl" />
      <ProtocolLibrary protocols={protocols} forceView={"cells"} count={count} chains={chains} />
    </Container>
  );
}
