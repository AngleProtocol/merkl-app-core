import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Container, Fmt, Group, Icon, Space, Text, useWalletContext } from "dappkit";
import { useMemo } from "react";
import { isAddress } from "viem";
import { I18n } from "../../../I18n";
import ReinvestBanner from "../../../components/element/reinvest/ReinvestBanner";
import ClaimRewardsLibrary from "../../../components/element/rewards/ClaimRewardsLibrary";
import merklConfig from "../../../config";
import useBalances from "../../../hooks/useBalances";
import type { OutletContextRewards } from "./user.$address.header";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  return { address };
}

export default function Index() {
  const { address } = useLoaderData<typeof loader>();
  const { rewards: sortedRewards, onClaimSuccess } = useOutletContext<OutletContextRewards>();

  const { chainId } = useWalletContext();
  const { balances, loading: balanceLoading } = useBalances(chainId);

  const tokenBalance = useMemo(() => {
    if (!balances || balanceLoading) return 0;
    const token = balances?.find(
      balance => balance?.address?.toLowerCase() === merklConfig.dashboard?.reinvestTokenAddress?.toLowerCase(),
    );
    if (!token) return 0;
    return Fmt.toNumber(token?.balance, token?.decimals);
  }, [balances, balanceLoading]);

  return (
    <Container>
      <Space size="md" />
      {!!I18n.trad.get.pages.dashboard.reinvest && tokenBalance > 0 && <ReinvestBanner />}
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
