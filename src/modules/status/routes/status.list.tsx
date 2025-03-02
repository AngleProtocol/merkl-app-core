import { ChainService } from "@core/modules/chain/chain.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import StatusLibrary from "../components/library/StatusLibrary";
import { StatusService } from "../status.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();

  const statusAndDelays = await StatusService.getStatusAndDelays();

  return withUrl(request, {
    chains,
    statusAndDelays,
  });
}

export default function Index() {
  const { chains, statusAndDelays } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <StatusLibrary chains={chains} data={statusAndDelays} />
    </Container>
  );
}
