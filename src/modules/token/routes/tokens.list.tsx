import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { Cache } from "../../../modules/cache/cache.service";
import { TokenService } from "../../../modules/token/token.service";
import TokenLibrary from "../components/library/TokenLibrary";

export async function loader({ request }: LoaderFunctionArgs) {
  const { tokens, count } = await TokenService.getManyFromRequest(request);

  return { tokens, count };
}

export const clientLoader = Cache.wrap("tokens", 300);

export default function Index() {
  const { tokens, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <TokenLibrary tokens={tokens} count={count} />
    </Container>
  );
}
