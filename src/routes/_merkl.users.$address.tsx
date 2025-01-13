import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, json, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Divider, Dropdown, Group, Hash, Icon, Text, Value } from "dappkit";
import config from "merkl.config";
import TransactionButton, { type TransactionButtonProps } from "packages/dappkit/src/components/dapp/TransactionButton";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import { RewardService } from "src/api/services/reward.service";
import { TokenService } from "src/api/services/token.service";
import Hero from "src/components/composite/Hero";
import AddressEdit from "src/components/element/AddressEdit";
import Token from "src/components/element/token/Token";
import useReward from "src/hooks/resources/useReward";
import useRewards from "src/hooks/resources/useRewards";
import { isAddress } from "viem";

export async function loader({ params: { address }, request }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  const rewards = await RewardService.getForUser(request, address);
  const token = !!config.rewardsTotalClaimableMode
    ? (
        await TokenService.getMany({
          address: config.rewardsTotalClaimableMode,
        })
      )?.[0]
    : null;

  return json({ rewards, address, token });
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [
    {
      title: `${data?.address?.substring(0, 6)}…${data?.address.substring(data?.address.length - 4)} on Merkl`,
    },
  ];
};

export type OutletContextRewards = {
  rewards: ReturnType<typeof useRewards>["sortedRewards"];
  onClaimSuccess: TransactionButtonProps["onSuccess"];
};

export default function Index() {
  const { rewards: raw, address, token: rawToken } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  const onClaimSuccess = async (_hash: string) => {
    await fetcher.submit(null, { method: "post", action: `/claim/${address}?chainId=${chainId}` });
  };

  const rawRewards = useMemo(() => fetcher?.data?.rewards ?? raw, [raw, fetcher?.data?.rewards]);
  const token = useMemo(() => fetcher?.data?.token ?? rawToken, [rawToken, fetcher?.data?.token]);

  const rewards = useRewards(rawRewards);

  const isSingleChain = config?.chains?.length === 1;

  const { chainId, chains, address: user } = useWalletContext();
  const chain = useMemo(() => chains?.find(c => c.id === chainId), [chainId, chains]);
  const reward = useMemo(() => raw.find(({ chain: { id } }) => id === chainId), [chainId, raw]);
  const { claimTransaction } = useReward(reward, user);

  const isUserRewards = useMemo(() => user === address, [user, address]);
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
            <Icon size="sm" remix="RiDropFill" />
            Liquidity
          </>
        ),
        link: `/users/${address}/liquidity?chainId=${chainId}`,
        key: "LiquidityUserChain",
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
    return baseTabs.filter(tab => !(tab.key === "LiquidityUserChain" && !config.dashboard.liquidityTab.enabled));
  }, [address, chainId]);

  return (
    <Hero
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
            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.unclaimed)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.unclaimed}
                </Value>
              )}
              <Text size={"xl"} bold className="not-italic">
                Total Claimable
              </Text>
            </Group>
            <Group className="flex-col">
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

          <Divider vertical className="m-0 hidden lg:block" look="bold" />
          <Divider horizontal className="m-0 lg:hidden" look="bold" />

          <Group className="flex-1 gap-xl md:gap-xl*4 items-center lg:justify-end">
            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.pending)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.pending}
                </Value>
              )}
              <Text size="xl" bold className="not-italic">
                Pending Rewards
              </Text>
            </Group>

            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.earned)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.earned + rewards.pending}
                </Value>
              )}
              <Text size="xl" bold className="not-italic">
                Lifetime Earned
              </Text>
            </Group>
          </Group>
        </Group>
      }
      description={""}
      tabs={tabs}>
      <Outlet context={{ rewards: rewards.sortedRewards, onClaimSuccess } as OutletContextRewards} />
    </Hero>
  );
}
