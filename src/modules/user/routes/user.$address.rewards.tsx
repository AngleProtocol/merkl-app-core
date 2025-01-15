import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import { Container, Group, Icon, Space, Text } from "dappkit";
import { isAddress } from "viem";
import { I18n } from "../../../I18n";
import ClaimRewardsLibrary from "../../../components/element/rewards/ClaimRewardsLibrary";
import type { OutletContextRewards } from "./user.$address.header";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  return json({ address });
}

export default function Index() {
  const { address } = useLoaderData<typeof loader>();
  const { rewards: sortedRewards, onClaimSuccess } = useOutletContext<OutletContextRewards>();

  return (
    <Container>
      <Space size="md" />
      {!!I18n.trad.get.pages.dashboard.explanation && (
        <Group className="rounded-md p-md bg-main-5 flex-nowrap items-start">
          <Icon remix="RiInformation2Fill" className="text-lg text-accent-11 flex-shrink-0" />
          <Text look="bold" size="sm">
            {I18n.trad.get.pages.dashboard.explanation}
          </Text>
        </Group>
      )}
      <Space size="md" />
      <ClaimRewardsLibrary from={address} rewards={sortedRewards} onClaimSuccess={onClaimSuccess} />
    </Container>
  );
}
