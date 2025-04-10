import { useMerklConfig } from "@core/modules/config/config.context";
import { Box, Button, Container, Fmt, Group, Icon, OverrideTheme, Space, Text, useWalletContext } from "dappkit";
import { useMemo } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isAddress } from "viem";
import { I18n } from "../../../I18n";
import ReinvestBanner from "../../../components/element/reinvest/ReinvestBanner";
import ClaimRewardsLibrary from "../../../components/element/rewards/ClaimRewardsLibrary";
import useBalances from "../../../hooks/useBalances";
import type { OutletContextRewards } from "./user.$address.header";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  return { address };
}

export default function Index() {
  const { address } = useLoaderData<typeof loader>();
  const { rewards: sortedRewards, onClaimSuccess, isBlacklisted } = useOutletContext<OutletContextRewards>();
  const reinvestTokenAddress = useMerklConfig(store => store.config.dashboard.reinvestTokenAddress);
  const minWalletBalance = useMerklConfig(store => store.config.opportunity?.minWalletBalance);
  const links = useMerklConfig(store => store.config.links);

  const { chainId } = useWalletContext();
  const { balances, loading: balanceLoading } = useBalances(chainId);

  const tokenBalance = useMemo(() => {
    if (!balances || balanceLoading) return 0;
    const token = balances?.find(balance => balance?.address?.toLowerCase() === reinvestTokenAddress?.toLowerCase());
    if (!token) return 0;
    return Fmt.toNumber(token?.balance, token?.decimals);
  }, [balances, balanceLoading, reinvestTokenAddress]);

  return (
    <Container>
      <Space size="md" />
      {isBlacklisted && (
        <>
          <OverrideTheme coloring={"harm"}>
            <Box>
              <Text>
                This address has been flagged as suspicious for wash trading and dishonest behavior. As a result,
                unclaimed rewards are on hold and no new rewards will accumulate while the address remains blacklisted.
                If you believe this is a false positive - our detection algorithm is still in beta - please open a
                ticket on Merkl’s Discord for further review.
              </Text>
              <Space size="md" />
              <Group>
                <Button look="hype" to={links.merklSupport} external>
                  Contact Support
                  <Icon remix="RiArrowRightUpLine" />
                </Button>
              </Group>
            </Box>
          </OverrideTheme>
          <Space size="md" />
        </>
      )}
      {!!I18n.trad.get.pages.dashboard.explanation && (
        <>
          <Group className="rounded-md p-md bg-main-5 flex-nowrap items-start">
            <Icon remix="RiInformation2Fill" className="text-lg text-accent-11 flex-shrink-0" />
            <Text look="bold" size="sm">
              {I18n.trad.get.pages.dashboard.explanation}
            </Text>
          </Group>
          <Space size="md" />
        </>
      )}
      {!!I18n.trad.get.pages.dashboard.reinvest && tokenBalance > minWalletBalance && (
        <>
          <ReinvestBanner />
          <Space size="md" />
        </>
      )}
      <ClaimRewardsLibrary from={address} rewards={sortedRewards} onClaimSuccess={onClaimSuccess} />
    </Container>
  );
}
