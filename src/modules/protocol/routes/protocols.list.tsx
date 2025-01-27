import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { Cache } from "../../../modules/cache/cache.service";
import { ProtocolService } from "../../../modules/protocol/protocol.service";
import ProtocolLibrary from "../components/ProtocolLibrary";

export async function loader({ request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService.getManyFromRequest(request);

  return { protocols, count };
}

export const clientLoader = Cache.wrap("protocols", 300);

export default function Index() {
  const { protocols, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <ProtocolLibrary protocols={protocols} count={count} />
    </Container>
  );
}
