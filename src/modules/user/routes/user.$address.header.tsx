import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import MetricBox from "@core/modules/opportunity/components/element/MetricBox";
import { Container, Group, Icon, Space, Tabs, Value } from "dappkit";
import { TransactionButton, type TransactionButtonProps } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo, useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";
import useReward from "../../../hooks/resources/useReward";
import useRewards from "../../../hooks/resources/useRewards";
import useBalances from "../../../hooks/useBalances";
import { RewardService } from "../../../modules/reward/reward.service";
import { TokenService } from "../../../modules/token/token.service";
import Token from "../../token/components/element/Token";
import { UserService } from "../user.service";

export async function loader({ context: { backend, routes }, params: { address }, request }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw new Response("Address not found or invalid", { status: 404 });

  const rewards = await RewardService({ api, backend }).getForUser(address, new URL(request.url));
  const token = !!backend.rewardsTotalClaimableMode
    ? (
        await TokenService({ backend, api, request }).getMany({
          address: backend.rewardsTotalClaimableMode,
        })
      )?.[0]
    : null;
  const isBlacklisted = await UserService({ api }).isBlacklisted(address);

  return {
    rewards,
    address,
    token,
    isBlacklisted,
    request,
    backend,
    routes,
    ...MetadataService({ backend, routes, request }).fill("user", { address }),
  };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export type OutletContextRewards = {
  rewards: ReturnType<typeof useRewards>["sortedRewards"];
  onClaimSuccess: TransactionButtonProps["onSuccess"];
  isBlacklisted: boolean;
};

/**
 * @todo reduce Index size, either with hooks or by calling other components
 * @returns
 */
export default function Index() {
  const { rewards: raw, address, token, isBlacklisted, url, backend } = useLoaderData<typeof loader>();
  const { chainId, chains, address: user } = useWalletContext();

  const { reload: reloadBalances } = useBalances();
  const [reloadedRewards, setReloadedRewards] = useState<typeof raw>(raw);

  const onClaimSuccess = async (_hash: string) => {
    track("Click on button", { button: "claim", type: "header" });

    setReloadedRewards(await RewardService({ api, backend }).getForUser(address, new URL(`${url}?chainId=${chainId}`)));
    await reloadBalances();
  };

  const rawRewards = useMemo(() => reloadedRewards ?? raw, [raw, reloadedRewards]);

  const { earned, pending, sortedRewards, unclaimed, isOnlyPointOrTest, pointAggregation } = useRewards(rawRewards);

  const merklChains = useMerklConfig(store => store.config.chains);
  const isSingleChain = merklChains?.length === 1;
  const rewardsTotalClaimableMode = useMerklConfig(store => store.config.rewardsTotalClaimableMode);
  const decimalFormatUsd = useMerklConfig(store => store.config.decimalFormat.dollar);
  const decimalFormatPoint = useMerklConfig(store => store.config.decimalFormat.point);

  const chain = useMemo(() => chains?.find(c => c.id === chainId), [chainId, chains]);
  const reward = useMemo(() => rawRewards.find(({ chain: { id } }) => id === chainId), [chainId, rawRewards]);
  const { claimTransaction } = useReward(reward, user);

  const metadata = useMetadata(url);
  const { track } = useMixpanelTracking();

  const isUserRewards = useMemo(() => UserService({}).isSame(user, address), [user, address]);
  const isAbleToClaim = useMemo(
    () => isUserRewards && reward && !reward.rewards.every(({ amount, claimed }) => amount === claimed),
    [isUserRewards, reward],
  );

  // Dynamically filter tabs based on config
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        label: (
          <>
            <Icon size="sm" remix="RiGift2Fill" />
            Rewards
          </>
        ),
        link: `/users/${address}`,
        key: crypto.randomUUID(),
      },
      {
        label: (
          <>
            <Icon size="sm" remix="RiListCheck3" />
            History
          </>
        ),
        link: `/users/${address}/claims`,
        key: crypto.randomUUID(),
      },
    ];

    // Remove the Liquidity tab if disabled in the config
    return baseTabs;
  }, [address]);

  return (
    <Hero
      compact
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={metadata.find(metadata.wrapInPage("user", { address }), "title")}
      description={metadata.find(metadata.wrapInPage("user", { address }), "description")}>
      <Container>
        <Group className="w-full mt-xl*2 mb-xl" size="xl">
          <MetricBox
            label="Total Earned"
            value={
              <Value format={isOnlyPointOrTest ? decimalFormatPoint : decimalFormatUsd} value className="text-main-12">
                {isOnlyPointOrTest
                  ? (pointAggregation?.earned ?? 0) + (pointAggregation?.pending ?? 0)
                  : earned + pending}
              </Value>
            }
          />
          <MetricBox
            label="Claimable soon"
            value={
              <Value format={isOnlyPointOrTest ? decimalFormatPoint : decimalFormatUsd} value className="text-main-12">
                {isOnlyPointOrTest ? pointAggregation?.pending : pending}
              </Value>
            }
          />
          <MetricBox
            label="Claimable now"
            look={unclaimed > 0 ? "hype" : "bold"}
            value={
              isAddress(rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(unclaimed)} format="amount_price" showZero />
              ) : (
                <Value
                  format={isOnlyPointOrTest ? decimalFormatPoint : decimalFormatUsd}
                  value
                  className="text-main-12">
                  {isOnlyPointOrTest ? pointAggregation?.unclaimed : unclaimed}
                </Value>
              )
            }
          />
          {isAbleToClaim && (
            <Group className="justify-center items-center">
              <TransactionButton
                name="Claim Rewards"
                enableSponsorCheckbox
                disabled={!claimTransaction}
                look="hype"
                size="lg"
                tx={claimTransaction}
                onSuccess={onClaimSuccess}>
                {isSingleChain ? "Claim Now" : `Claim on ${chain?.name}`}
                <Icon remix="RiHandCoinFill" />
              </TransactionButton>
            </Group>
          )}
        </Group>
        <Space size="xl" />
        <Tabs tabs={tabs} look="base" size="lg" />
        <Space size="xl" />
      </Container>
      <Outlet context={{ rewards: sortedRewards, onClaimSuccess, isBlacklisted } as OutletContextRewards} />
    </Hero>
  );
}
