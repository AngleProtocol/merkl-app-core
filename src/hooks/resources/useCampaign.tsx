import type { Campaign as CampaignFromApi } from "@merkl/api";
import type { Opportunity } from "@merkl/api"
import { Bar, Icon } from "dappkit";
import { Group, Text, Value } from "dappkit";
import { Time } from "dappkit";
import moment from "moment";
import { type ReactNode, useMemo } from "react";
import { parseUnits } from "viem";
import type { RuleType } from "../../components/element/campaign/rules/Rule";
import Token from "../../components/element/token/Token";
import type { Campaign } from "../../modules/campaigns/campaign.model";

export default function useCampaign(campaign: CampaignFromApi, opportunity?: Opportunity) {
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
        {!live && "Ended "}
        <Time timestamp={Number(campaign.endTimestamp) * 1000} />
      </>
    );
  }, [campaign.endTimestamp]);

  const rules = useMemo(() => {
    const typeSpecificRule: { [C in CampaignFromApi["type"]]?: (scopedCampaign: Campaign<C>) => RuleType[] } = {
      CLAMM: c =>
        (
          [
            {
              type: "liquidity" as const,
              value: {
                description: `${
                  c.params.weightFees / 100
                }% of campaign rewards are split amongst liquidity providers based on the fees their positions earn`,
                label: (
                  <>
                    <Icon remix="RiDiscountPercentFill" />
                    Fees
                  </>
                ),
                percentage: c.params.weightFees,
              },
            },
            !!opportunity && {
              type: "liquidity" as const,
              value: {
                description: `${
                  c.params.weightToken0 / 100
                }% of campaign rewards are split amongst liquidity providers based on the amount of ${
                  opportunity.tokens?.[0].symbol
                } held in their positions. The more ${
                  opportunity.tokens?.[0].symbol
                } they hold over time relative to others, the greater their share of rewards`,
                label: <Token value token={opportunity.tokens?.[0]} />,
                percentage: c.params.weightToken0,
              },
            },
            !!opportunity && {
              type: "liquidity" as const,
              value: {
                description: `${
                  c.params.weightToken1 / 100
                }% of campaign rewards are split amongst liquidity providers based on the amount of ${
                  opportunity.tokens?.[1].symbol
                } held in their positions. The more ${
                  opportunity.tokens?.[1].symbol
                } they hold over time relative to others, the greater their share of rewards`,
                label: <Token value token={opportunity.tokens?.[1]} />,
                percentage: c.params.weightToken1,
              },
            },
            !c.params.isOutOfRangeIncentivized && {
              type: "boolean",
              value: {
                description: "Out-of-range positions do not earn rewards",
                label: (
                  <>
                    <Icon remix="RiStockFill" />
                    In Range
                  </>
                ),
              },
            },
          ] as const
        ).filter(a => !!a),
    };

    const noListTypes = ["JSON_AIRDROP", "ERC20_SNAPSHOT", "INVALID"] as const satisfies Campaign["type"][];
    type WithList = Exclude<Campaign["type"], (typeof noListTypes)[number]>;

    const blacklist: RuleType<"address"> | undefined = !noListTypes.includes(
      campaign.type as (typeof noListTypes)[number],
    )
      ? (campaign as Campaign<WithList>).params.blacklist.length
        ? {
            type: "address",
            value: {
              label: (
                <>
                  <Icon remix="RiSpam3Fill" />
                  Blacklist
                </>
              ),
              chain: campaign.chain,
              description:
                "The following blacklisted addresses don’t earn rewards. If a liquidity manager (ALM) address is blacklisted, any addresses linked to it are also ineligible",
              addresses: (campaign as Campaign<WithList>).params.blacklist,
            },
          }
        : undefined
      : undefined;

    const whitelist: RuleType<"address"> | undefined = !noListTypes.includes(
      campaign.type as (typeof noListTypes)[number],
    )
      ? (campaign as Campaign<WithList>).params.whitelist.length
        ? {
            type: "address",
            value: {
              description:
                "Only the following addresses are eligible for rewards. If a liquidity manager (ALM) address is whitelisted, any addresses that provided liquidity via the ALM are also eligible",
              label: (
                <>
                  <Icon remix="RiProhibitedFill" />
                  Whitelist
                </>
              ),
              chain: campaign.chain,
              addresses: (campaign as Campaign<WithList>).params.whitelist,
            },
          }
        : undefined
      : undefined;

    return (
      ([] as RuleType[])
        // biome-ignore lint/suspicious/noExplicitAny: type is enforced above
        .concat(typeSpecificRule?.[campaign.type]?.(campaign as any) ?? [])
        .concat([blacklist, whitelist].filter(a => !!a))
    );
  }, [campaign, opportunity]);

  const profile = useMemo(() => {
    type ProfileReducer = {
      [C in Opportunity["type"]]?: (_campaign: CampaignFromApi<C>) => ReactNode;
    };

    const reducer: ProfileReducer = {
      CLAMM: ({ params }) => {
        return (
          <Group size="xl" className="flex-nowrap [&>*]:flex-col [&>*]:justify-center">
            {[
              { label: "Fees", value: params.weightFees / 10000 },
              {
                label: params.symbolToken0,
                value: params.weightToken0 / 10000,
              },
              {
                label: params.symbolToken1,
                value: params.weightToken1 / 10000,
              },
            ].map(({ label, value }) => {
              return (
                <Group key={`${label}:${value}`} size="sm" className="justify-center gap-0">
                  <Text size="sm">{label}</Text>
                  <Value className="text-main-12 text-center" format="0a%">
                    {value}
                  </Value>
                </Group>
              );
            })}
          </Group>
        );
      },
    };
    return reducer[campaign.type]?.(campaign);
  }, [campaign]);

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
    profile,
    rules,
    progressBar,
    active,
  };
}
