import { ChainService } from "@core/modules/chain/chain.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Box, Checkbox, Container, Group, Space } from "dappkit";
import StatusLibrary from "../components/library/StatusLibrary";
import { StatusService } from "../status.service";
import { useState } from "react";

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

  const [hideChainWithoutLiveCampaigns, setHideChainWithoutLiveCampaigns] = useState(true);

  return (
    <Container>
      <Space size="xl" />
      <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden">
        <Group className="justify-between flex-nowrap overflow-x-scroll">
          <Checkbox
            size="md"
            label="Show only delayed"
            state={[hideChainWithoutLiveCampaigns, setHideChainWithoutLiveCampaigns]}
          />
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
