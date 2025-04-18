import { api } from "@core/api";
import { ChainService } from "@core/index.generated";
import { Container, Space } from "dappkit";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import RewardTokenLibrary from "../components/library/RewardTokenLibrary";
import { IntegrationsService } from "../integration.service";

export async function loader({ request, context: { backend } }: LoaderFunctionArgs) {
  const rewardTokens = await IntegrationsService({ api, request }).getAll();
  const chains = await ChainService({ api, request, backend }).getAll();
  return { rewardTokens, chains };
}

export default function Index() {
  const { rewardTokens, chains } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <RewardTokenLibrary rewardTokens={rewardTokens} chains={chains} />
    </Container>
  );
}
