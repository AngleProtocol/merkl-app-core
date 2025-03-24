import AprModal from "@core/components/element/apr/AprModal";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Link } from "react-router";
import type { BoxProps } from "dappkit";
import { Dropdown, Group, Icon, Icons as IconGroup, Text, Title, Value, mergeClass } from "dappkit";
import { EventBlocker } from "dappkit";
import { useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import useOpportunityTable from "../../hooks/useOpportunityTable";

export type OpportunityTableRowProps = {
  opportunity: Opportunity;
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityTableRow({
  opportunity,
  className,
  navigationMode,
  ...props
}: OpportunityTableRowProps) {
  const { name, tags, link, icons, Tags } = useOpportunityData(opportunity);
  const { rewardsBreakdown, formattedDailyRewards } = useOpportunityRewards(opportunity);
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const aprFormat = useMerklConfig(store => store.config.decimalFormat.apr);
  const opportunityLibraryRowView = useMerklConfig(store => store.config.opportunityLibrary.rowView);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();
  const { OpportunityRow, opportunityColumns } = useOpportunityTable(opportunity);

  const aprColumn = useMemo(
    () => (
      <EventBlocker>
        <Dropdown size="xl" onHover content={<AprModal opportunity={opportunity} />}>
          <Text bold look="tint" size="lg">
            <Value value format={aprFormat}>
              {opportunity.apr / 100}
            </Value>
          </Text>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity, aprFormat],
  );

  const tvlColumn = useMemo(
    () => (
      <Text bold look="tint" size="lg">
        <Value value format={dollarFormat}>
          {opportunity.tvl ?? 0}
        </Value>
      </Text>
    ),
    [opportunity, dollarFormat],
  );

  const rewardsColumn = useMemo(
    () => (
      <Group size="sm">
        <Text look="hype" bold size="lg">
          <Value value format={dollarFormat}>
            {opportunity.dailyRewards ?? 0}
          </Value>
        </Text>
        <IconGroup>
          {rewardsBreakdown.map(({ token: { icon } }) => (
            <Icon key={icon} src={icon} />
          ))}
        </IconGroup>
      </Group>
    ),
    [opportunity, rewardsBreakdown, dollarFormat],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: cannot include props
  const row = useMemo(() => {
    switch (opportunityLibraryRowView) {
      case "classic":
        return (
          <OpportunityRow
            size="lg"
            content="sm"
            className={mergeClass("cursor-pointer ease hover:bg-main-2", className)}
            {...props}
            {...opportunityColumns}
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
                  <Tags tags={["chain", "protocol", "status"]} size="sm" />
                </Group>
              </Group>
            }
          />
        );
    }
  }, [
    opportunity,
    opportunityLibraryRowView,
    aprColumn,
    tvlColumn,
    className,
    rewardsColumn,
    icons,
    overflowing,
    ref,
    tags,
  ]);

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{row}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {row}
    </Link>
  );
}
