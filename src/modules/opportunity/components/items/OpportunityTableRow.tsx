import type { TagTypes } from "@core/components/element/Tag";
import AprModal from "@core/components/element/apr/AprModal";
import merklConfig from "@core/config";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import { OpportunityRow } from "@core/modules/opportunity/components/library/OpportunityTable";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import TokenAmountModal from "@core/modules/token/components/TokenAmountModal";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Dropdown, Group, Icon, Icons as IconGroup, PrimitiveTag, Text, Title, Value, mergeClass } from "dappkit";
import { EventBlocker } from "dappkit";
import { useOverflowingRef } from "dappkit";
import { useMemo } from "react";

export type OpportunityTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityTableRow({
  hideTags,
  opportunity,
  className,
  navigationMode,
  ...props
}: OpportunityTableRowProps) {
  const { name, tags, link, icons, Tags, Icons } = useOpportunityData(opportunity);
  const { rewardsBreakdown, formattedDailyRewards } = useOpportunityRewards(opportunity);

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
            <IconGroup>
              {rewardsBreakdown.map(({ token: { icon } }) => (
                <Icon key={icon} src={icon} />
              ))}
            </IconGroup>
          </PrimitiveTag>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity, rewardsBreakdown],
  );

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
                    <Icons groupProps={{ className: "flex-nowrap" }} />
                  </Group>
                  <Group>
                    <Title
                      h={3}
                      size={4}
                      ref={ref}
                      className={mergeClass(
                        overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                      )}>
                      {name}
                    </Title>
                  </Group>
                </Group>

                <Group className="items-center">
                  <Tags hide={hideTags} size="sm" />
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
              <Group className="flex-col w-full lg:text-nowrap lg:whitespace-nowrap lg:text-ellipsis">
                <Group className="text-nowrap whitespace-nowrap min-w-0 flex-nowrap items-center overflow-hidden max-w-full">
                  {formattedDailyRewards}
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
                      {name}
                    </Title>
                  </Group>
                </Group>

                <Group className="items-center">
                  <Tags hide={hideTags} size="sm" />
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
