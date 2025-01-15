import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Dropdown, Fmt, Group, Icon, Icons, PrimitiveTag, Text, Title, Value, mergeClass } from "dappkit";
import { EventBlocker } from "dappkit";
import { useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import merklConfig from "../../../config";
import type { OpportunityNavigationMode } from "../../../config/opportunity";
import useOpportunity from "../../../hooks/resources/useOpportunity";
import type { Opportunity } from "../../../modules/opportunity/opportunity.model";
import Tag, { type TagTypes } from "../Tag";
import AprModal from "../apr/AprModal";
import TokenAmountModal from "../token/TokenAmountModal";
import OpportunityParticipateModal from "./OpportunityParticipateModal";
import { OpportunityRow } from "./OpportunityTable";

export type OpportunityTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityTableRow({
  hideTags,
  opportunity: opportunityRaw,
  className,
  navigationMode,
  ...props
}: OpportunityTableRowProps) {
  const { tags, link, icons, rewardsBreakdown, opportunity } = useOpportunity(opportunityRaw);

  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const aprColumn = useMemo(
    () => (
      <EventBlocker>
        <Dropdown size="xl" content={<AprModal opportunity={opportunity} />}>
          <PrimitiveTag look="hype" size="lg">
            <Value value format="0a%">
              {opportunity.apr / 100}
            </Value>
          </PrimitiveTag>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity],
  );

  const tvlColumn = useMemo(
    () => (
      <EventBlocker>
        <Dropdown size="xl" content={<AprModal opportunity={opportunity} />}>
          <PrimitiveTag look="base" className="font-mono">
            <Value value format={merklConfig.decimalFormat.dollar}>
              {opportunity.tvl ?? 0}
            </Value>
          </PrimitiveTag>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity],
  );

  const rewardsColumn = useMemo(
    () => (
      <EventBlocker>
        <Dropdown
          className="py-xl"
          content={
            <TokenAmountModal
              tokens={rewardsBreakdown}
              label={
                <Group size="sm">
                  <Icon remix="RiGift2Fill" />
                  <Text size="sm" className="text-main-12" bold>
                    Daily Rewards
                  </Text>
                </Group>
              }
            />
          }>
          <PrimitiveTag look="base" className="font-mono">
            <Value value format={merklConfig.decimalFormat.dollar}>
              {opportunity.dailyRewards ?? 0}
            </Value>
            <Icons>
              {rewardsBreakdown.map(({ token: { icon } }) => (
                <Icon key={icon} src={icon} />
              ))}
            </Icons>
          </PrimitiveTag>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity, rewardsBreakdown],
  );

  const renderDailyRewards = useMemo(() => {
    if (merklConfig.opportunity.library.dailyRewardsTokenAddress) {
      const breakdowns = opportunity.rewardsRecord.breakdowns.filter(breakdown => {
        return breakdown?.token.address === merklConfig.opportunity.library.dailyRewardsTokenAddress;
      });
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => {
        return acc + breakdown.amount;
      }, 0n);
      return (
        <>
          <Title h={3} size={3} look="soft">
            <Value value format={"0,0.##a"}>
              {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
            </Value>

            {` ${token?.symbol}`}
          </Title>
          <Text className="text-xl">
            <Icon key={token?.icon} src={token?.icon} />
          </Text>
        </>
      );
    }
    return (
      <Title h={3} size={3} look="soft">
        <Value value format={merklConfig.decimalFormat.dollar}>
          {opportunity.dailyRewards ?? 0}
        </Value>
      </Title>
    );
  }, [opportunity]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: cannot include props
  const row = useMemo(() => {
    switch (merklConfig.opportunityLibrary.rowView) {
      case "classic":
        return (
          <OpportunityRow
            size="lg"
            content="sm"
            className={mergeClass("cursor-pointer", className)}
            {...props}
            aprColumn={aprColumn}
            tvlColumn={tvlColumn}
            rewardsColumn={rewardsColumn}
            opportunityColumn={
              <Group className="flex-col w-full">
                <Group className="min-w-0 flex-nowrap overflow-hidden max-w-full">
                  <Group className="text-xl items-center">
                    <Icons className="flex-nowrap">{icons}</Icons>
                  </Group>
                  <Group>
                    <Title
                      h={3}
                      size={4}
                      ref={ref}
                      className={mergeClass(
                        overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                      )}>
                      {merklConfig.opportunityPercentage
                        ? opportunity.name
                        : opportunity.name.replace(/\s*\d+(\.\d+)?%$/, "").trim()}
                    </Title>
                  </Group>
                </Group>

                <Group className="items-center">
                  {tags
                    ?.filter(a => a !== undefined)
                    ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                    .map(tag => (
                      <Tag filter key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="sm" />
                    ))}
                </Group>
              </Group>
            }
          />
        );
      case "rewards":
        return (
          <OpportunityRow
            size="lg"
            content="sm"
            className={mergeClass("cursor-pointer", className)}
            {...props}
            aprColumn={aprColumn}
            tvlColumn={tvlColumn}
            rewardsColumn={rewardsColumn}
            opportunityColumn={
              <Group className="flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
                <Group className="text-nowrap whitespace-nowrap min-w-0 flex-nowrap items-center overflow-hidden max-w-full">
                  {renderDailyRewards}
                </Group>
                <Group className="items-center">
                  <Group>
                    <Title
                      h={3}
                      size={4}
                      ref={ref}
                      className={mergeClass(
                        overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                      )}>
                      {merklConfig.opportunityPercentage
                        ? opportunity.name
                        : opportunity.name.replace(/\s*\d+(\.\d+)?%$/, "").trim()}
                    </Title>
                  </Group>
                </Group>

                <Group className="items-center">
                  {tags
                    ?.filter(a => a !== undefined)
                    ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                    .map(tag => (
                      <Tag filter key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="sm" />
                    ))}
                </Group>
              </Group>
            }
          />
        );
    }
  }, [opportunity, aprColumn, tvlColumn, hideTags, className, rewardsColumn, icons, overflowing, ref, tags]);

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{row}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {row}
    </Link>
  );
}
