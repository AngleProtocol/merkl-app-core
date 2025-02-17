import Tag, { type TagProps, type TagType, type TagTypes } from "@core/components/element/Tag";
import type { Status } from "@core/config/status";
import useChain from "@core/modules/chain/hooks/useChain";
import type { Campaign as CampaignFromApi } from "@merkl/api";
import { Bar, type Component, type Look } from "dappkit";
import { Group, Text } from "dappkit";
import { Time } from "dappkit";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { parseUnits } from "viem";

/**
 * Formats basic metadata for a given opportunity
 */

export default function useCampaignMetadata(campaign: CampaignFromApi) {
  const { chain: computeChain } = useChain({ id: campaign.computeChainId });

  if (!campaign)
    return {
      amount: undefined,
      time: undefined,
      profile: undefined,
      dailyRewards: undefined,
      progressBar: undefined,
      active: undefined,
    };

  // ─── Campaign Amount Prices ──────────────────────────────────

  const amount = useMemo(() => {
    return parseUnits(campaign.amount, 0);
  }, [campaign?.amount]);

  const dayspan = useMemo(() => {
    const duration = campaign.endTimestamp - campaign.startTimestamp;
    const oneDayInSeconds = BigInt(3600 * 24);
    const dayspan = BigInt(duration) / BigInt(oneDayInSeconds) || BigInt(1);

    return dayspan;
  }, [campaign.startTimestamp, campaign.endTimestamp]);

  const dailyRewards = useMemo(() => {
    const amountInUnits = parseUnits(amount.toString(), 0);
    const dailyReward = amountInUnits / dayspan;

    return dailyReward;
  }, [amount, dayspan]);

  // ─── Campaign Amount Time displaying ──────────────────────────────────

  const time = useMemo(() => {
    const live = BigInt(campaign.endTimestamp) * 1000n > moment.now();
    return (
      <>
        {!live && "Ended "}
        <Time timestamp={Number(campaign.endTimestamp) * 1000} />
      </>
    );
  }, [campaign.endTimestamp]);

  const progressBar = useMemo(() => {
    const now = moment.now() / 1000;
    const duration = Number(campaign.endTimestamp - campaign.startTimestamp);
    const elapsed = now - Number(campaign.startTimestamp);
    const isThisYear = (ts: number) => moment.unix(ts).year() === moment().year();
    const startsThisYear = isThisYear(Number(campaign.startTimestamp));
    const endsThisYear = isThisYear(Number(campaign.startTimestamp));
    const ended = now >= campaign.endTimestamp;

    return (
      <Group className="w-full items-center">
        <Text size="sm">
          {/* {started ? "started" : "starts"}{" "} */}
          {moment(Number(campaign.startTimestamp) * 1000)
            .local()
            .format(startsThisYear ? "DD MMM" : "DD MMM YYYY ha")}
        </Text>
        <Bar
          className="grow"
          accent={"good"}
          total={duration}
          values={[{ value: elapsed, className: ended ? "bg-main-6" : "bg-accent-10" }]}
        />
        <Text size="sm">
          {/* {ended ? "ended" : "ends"}{" "} */}
          {moment(Number(campaign.endTimestamp) * 1000)
            .local()
            .format(endsThisYear ? "DD MMM" : "DD MMM YYYY ha")}
        </Text>
      </Group>
    );
  }, [campaign.startTimestamp, campaign.endTimestamp]);

  const active = useMemo(() => {
    return Number(campaign.endTimestamp) > moment().unix();
  }, [campaign.endTimestamp]);

  const link = useMemo(
    () => campaign && `/campaign/${campaign.chain?.name?.toLowerCase?.().replace(" ", "-")}/${campaign?.campaignId}`,
    [campaign],
  );

  const status: Status = useMemo(() => {
    if (Number(campaign.endTimestamp) < moment().unix()) return "PAST";
    if (Number(campaign.startTimestamp) > moment().unix()) return "SOON";
    return "LIVE";
  }, [campaign]);

  /**
   * TagProps for each metadata that can be represented as a tag
   */
  const tags = useMemo(() => {
    const tag = <T extends keyof TagTypes>(tagType: T, value: TagType<T>["value"]) =>
      !!value
        ? {
            type: tagType,
            value,
            key: `${tagType}_${
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              (value as any)?.address ?? (value as any)?.name ?? value
            }`,
          }
        : undefined;
    const isSameChain = campaign.chain.id === computeChain?.id;
    const chains = isSameChain
      ? [tag("chain", campaign.chain)]
      : [tag("chain", campaign.chain), tag("chain", computeChain!)];

    return [...chains, tag("token", campaign.rewardToken), tag("status", status)].filter(a => a !== undefined);
  }, [computeChain, status, campaign]);

  /**
   * Extensible tags components that can be filtered
   * @param hide which tags to filers out
   * @param props tag item props
   */
  const Tags = useCallback(
    function TagsComponent({
      hide,
      only,
      ...props
    }: { hide?: (keyof TagTypes)[]; only?: (keyof TagTypes)[]; look?: Look } & Omit<
      Component<TagProps<keyof TagTypes>, HTMLButtonElement>,
      "value" | "type"
    >) {
      return tags
        ?.filter(a => a !== undefined)
        ?.filter(({ type }) => !hide || !hide.includes(type))
        ?.filter(({ type }) => !only || only.includes(type))
        .map(tag => <Tag {...tag} key={tag.key} size="sm" {...props} />);
    },
    [tags],
  );

  return {
    amount,
    dailyRewards,
    time,
    progressBar,
    link,
    tags,
    status,
    Tags,
    dayspan,
    active,
  };
}
