import { api } from "@core/api";
import { Container, Space } from "dappkit";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { IntegrationsService } from "../integration.service";
import RewardTokenLibrary from "../components/library/RewardTokenLibrary";

export async function loader(_args: LoaderFunctionArgs) {
  const rewardTokens = await IntegrationsService({ api }).getAll();
  return { rewardTokens };
}

export default function Index() {
  const { rewardTokens } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <RewardTokenLibrary rewardTokens={rewardTokens} />
    </Container>
  );
}
