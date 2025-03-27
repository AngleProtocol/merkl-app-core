import { api } from "@core/api";
import { ChainService } from "@core/modules/chain/chain.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Box, Checkbox, Container, Group, Space, Text } from "dappkit";
import { useState } from "react";
import StatusLibrary from "../components/library/StatusLibrary";
import { StatusService } from "../status.service";

export async function loader({ request, context: { backend } }: LoaderFunctionArgs) {
  const chains = await ChainService({ api, backend }).getAll();
  const statusAndDelays = await StatusService({ api }).getStatusAndDelays();

  return withUrl(request, {
    chains,
    statusAndDelays,
  });
}

export default function Index() {
  const { chains, statusAndDelays } = useLoaderData<typeof loader>();

  const [hideChainWithoutLiveCampaigns, setHideChainWithoutLiveCampaigns] = useState(true);

  return (
    <Container>
      <Space size="xl" />
      <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
        <Group className="flex-nowrap items-center">
          <Checkbox size="md" state={[hideChainWithoutLiveCampaigns, setHideChainWithoutLiveCampaigns]} />
          <Text>Show only chains with live campaigns</Text>
        </Group>
      </Box>
      <StatusLibrary
        chains={chains}
        data={statusAndDelays}
        hideChainWithoutLiveCampaigns={hideChainWithoutLiveCampaigns}
      />
    </Container>
  );
}
