import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useFetcher, useLoaderData } from "react-router";
import { Button, Dropdown, Group, Hash, Icon, Text, Value } from "dappkit";
import { TransactionButton, type TransactionButtonProps } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo } from "react";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";
import AddressEdit from "../../../components/element/AddressEdit";
import useReward from "../../../hooks/resources/useReward";
import useRewards from "../../../hooks/resources/useRewards";
import useBalances from "../../../hooks/useBalances";
import { RewardService } from "../../../modules/reward/reward.service";
import { TokenService } from "../../../modules/token/token.service";
import Token from "../../token/components/element/Token";
import { UserService } from "../user.service";

export async function loader({ context: { backend, routes }, params: { address }, request }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  const rewards = await RewardService({ api, backend, request }).getForUser(address);
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
    backend,
    routes,
    ...MetadataService({ backend, routes, request }).fill(),
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
  const { rewards: raw, address, token: rawToken, isBlacklisted } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  const { reload: reloadBalances } = useBalances();

  const onClaimSuccess = async (_hash: string) => {
    reloadBalances();
    await fetcher.submit(null, { method: "post", action: `/claim/${address}?chainId=${chainId}` });
  };

  const rawRewards = useMemo(() => fetcher?.data?.rewards ?? raw, [raw, fetcher?.data?.rewards]);
  const token = useMemo(() => fetcher?.data?.token ?? rawToken, [rawToken, fetcher?.data?.token]);

  const rewards = useRewards(rawRewards);

  const merklChains = useMerklConfig(store => store.config.chains);
  const isSingleChain = merklChains?.length === 1;
  const rewardsTotalClaimableMode = useMerklConfig(store => store.config.rewardsTotalClaimableMode);
  const decimalFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const { chainId, chains, address: user } = useWalletContext();
  const chain = useMemo(() => chains?.find(c => c.id === chainId), [chainId, chains]);
  const reward = useMemo(() => rawRewards.find(({ chain: { id } }) => id === chainId), [chainId, rawRewards]);
  const { claimTransaction } = useReward(reward, user);

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
            Claims
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
      breadcrumbs={[
        { link: "/users/", name: "Users" },
        {
          link: `/users/${address ?? ""}`,
          component: (
            <>
              <Icon remix="RiArrowRightSLine" className="text-main-12" />
              <Hash copy format="full" size="xs" className="text-main-12">
                {address}
              </Hash>
              <Dropdown size="md" padding="xs" content={<AddressEdit />}>
                <Button look="soft" size="xs" aria-label="Edit address">
                  <Icon remix="RiEdit2Line" />
                </Button>
              </Dropdown>
            </>
          ),
        },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <Group className="w-full items-center flex justify-between gap-xl md:gap-x-xl*4">
          <Group className="flex-1 gap-xl md:gap-x-xl*4 items-center">
            <Group className="flex-col gap-sm md:gap-md">
              <Text size={"lg"} bold className="text-lg md:text-xl not-italic">
                Claimable Now
              </Text>
              {isAddress(rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.unclaimed)} format="amount_price" showZero />
              ) : (
                <Value format={decimalFormat} size={2} className="text-main-12">
                  {rewards.unclaimed}
                </Value>
              )}
            </Group>
            <Group className="flex-col gap-sm md:gap-md">
              <Text size="lg" bold className="text-lg md:text-xl not-italic">
                Total Earned
              </Text>
              {isAddress(rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" symbol token={token} amount={BigInt(rewards.earned)} format="amount_price" showZero />
              ) : (
                <Value format={decimalFormat} size={2} className="text-main-12">
                  {rewards.earned + rewards.pending}
                </Value>
              )}
            </Group>
            <Group className="flex-col gap-sm md:gap-md">
              {isAbleToClaim && (
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
              )}
            </Group>
          </Group>
        </Group>
      }
      description={"Claim your rewards"}
      tabs={tabs}>
      <Outlet context={{ rewards: rewards.sortedRewards, onClaimSuccess, isBlacklisted } as OutletContextRewards} />
    </Hero>
  );
}
