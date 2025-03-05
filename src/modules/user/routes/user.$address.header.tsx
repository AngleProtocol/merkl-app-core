import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Divider, Dropdown, Group, Hash, Icon, Text, Value } from "dappkit";
import { TransactionButton, type TransactionButtonProps } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo } from "react";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";
import AddressEdit from "../../../components/element/AddressEdit";
import merklConfig from "../../../config";
import useReward from "../../../hooks/resources/useReward";
import useRewards from "../../../hooks/resources/useRewards";
import useBalances from "../../../hooks/useBalances";
import { RewardService } from "../../../modules/reward/reward.service";
import { TokenService } from "../../../modules/token/token.service";
import Token from "../../token/components/element/Token";
import { UserService } from "../user.service";

export async function loader({ params: { address }, request }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  const rewards = await RewardService.getForUser(request, address);
  const token = !!merklConfig.rewardsTotalClaimableMode
    ? (
        await TokenService.getMany({
          address: merklConfig.rewardsTotalClaimableMode,
        })
      )?.[0]
    : null;

  return withUrl(request, { rewards, address, token });
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("dashboard", [data?.url, merklConfig, data?.address]);
};

export type OutletContextRewards = {
  rewards: ReturnType<typeof useRewards>["sortedRewards"];
  onClaimSuccess: TransactionButtonProps["onSuccess"];
};

export default function Index() {
  const { rewards: raw, address, token: rawToken } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  const { reload: reloadBalances } = useBalances();

  const onClaimSuccess = async (_hash: string) => {
    reloadBalances();
    await fetcher.submit(null, { method: "post", action: `/claim/${address}?chainId=${chainId}` });
  };

  const rawRewards = useMemo(() => fetcher?.data?.rewards ?? raw, [raw, fetcher?.data?.rewards]);
  const token = useMemo(() => fetcher?.data?.token ?? rawToken, [rawToken, fetcher?.data?.token]);

  const rewards = useRewards(rawRewards);

  // ------ HOTFIX > Summ breakdowns pending rewards @todo: to be removed when rewards.pending fixed

  const flatenedRewards = useMemo(
    () =>
      rewards.sortedRewards.flatMap(({ chain, rewards, distributor }) =>
        rewards.flatMap(reward =>
          reward.breakdowns.flatMap(breakdown => ({ chain, distributor, breakdown, token: reward.token })),
        ),
      ),
    [rewards.sortedRewards],
  );

  let totalPendingRewards = 0n;
  flatenedRewards.forEach(reward => {
    totalPendingRewards += BigInt(reward.breakdown.pending);
  });

  // ------ END

  const isSingleChain = merklConfig?.chains?.length === 1;

  const { chainId, chains, address: user } = useWalletContext();
  const chain = useMemo(() => chains?.find(c => c.id === chainId), [chainId, chains]);
  const reward = useMemo(() => rawRewards.find(({ chain: { id } }) => id === chainId), [chainId, rawRewards]);
  const { claimTransaction } = useReward(reward, user);

  const isUserRewards = useMemo(() => UserService.isSame(user, address), [user, address]);
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
    return baseTabs.filter(tab => !(tab.key === "LiquidityUserChain" && !merklConfig.dashboard.liquidityTab.enabled));
  }, [address, chainId]);

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
              {isAddress(merklConfig.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.unclaimed)} format="amount_price" showZero />
              ) : (
                <Value format={merklConfig.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.unclaimed}
                </Value>
              )}
              <Text size={"xl"} bold className="text-lg md:text-xl not-italic">
                Total Claimable
              </Text>
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

          <Divider vertical className="m-0 hidden lg:block" look="bold" />
          <Divider horizontal className="m-0 lg:hidden" look="bold" />

          <Group className="flex-1 gap-lg md:gap-xl*4 items-center lg:justify-end">
            <Group className="flex-col gap-sm md:gap-md">
              {isAddress(merklConfig.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(totalPendingRewards)} format="amount_price" showZero />
              ) : (
                <Value format={merklConfig.decimalFormat.dollar} size={2} className="text-main-12">
                  {totalPendingRewards.toString()}
                </Value>
              )}
              <Text size="xl" bold className="text-lg md:text-xl not-italic">
                Pending Rewards
              </Text>
            </Group>

            <Group className="flex-col gap-sm md:gap-md">
              {isAddress(merklConfig.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.earned)} format="amount_price" showZero />
              ) : (
                <Value format={merklConfig.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.earned + rewards.pending}
                </Value>
              )}
              <Text size="xl" bold className="text-lg md:text-xl not-italic">
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
