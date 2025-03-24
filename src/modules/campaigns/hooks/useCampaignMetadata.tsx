import type { Campaign as CampaignFromApi } from "@merkl/api";
import { Bar } from "dappkit";
import { Group, Text } from "dappkit";
import { Time } from "dappkit";
import moment from "moment";
import { useMemo } from "react";
import { parseUnits } from "viem";

/**
 * Formats basic metadata for a given opportunity
 */

export default function useCampaignMetadata(campaign: CampaignFromApi) {
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

  const dailyRewards = useMemo(() => {
    const duration = campaign.endTimestamp - campaign.startTimestamp;
    const oneDayInSeconds = BigInt(3600 * 24);
    const dayspan = BigInt(duration) / BigInt(oneDayInSeconds) || BigInt(1);
    const amountInUnits = parseUnits(amount.toString(), 0);
    const dailyReward = amountInUnits / dayspan;

    return dailyReward;
  }, [campaign, amount]);

  // ─── Campaign Amount Time displaying ──────────────────────────────────

  const time = useMemo(() => {
    const live = BigInt(campaign.endTimestamp) * 1000n > moment.now();
    return (
      <>
        <Time prefix=" " timestamp={Number(campaign.endTimestamp) * 1000} />
        {live && " left"}
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
    const started = now >= campaign.startTimestamp;

    return (
      <Group className="w-full items-center">
        <Text size="sm">
          {started ? "started" : "starts"}{" "}
          {moment(Number(campaign.startTimestamp) * 1000)
            .local()
            .format(startsThisYear ? "DD MMM" : "DD MMM YYYY")}
        </Text>
        <Bar
          className="grow"
          accent={"good"}
          total={duration}
          values={[{ value: elapsed, className: ended ? "bg-main-6" : "bg-accent-10" }]}
        />
        <Text size="sm">
          {ended ? "ended" : "ends"}{" "}
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

  return {
    amount,
    dailyRewards,
    time,
    progressBar,
    active,
  };
}
