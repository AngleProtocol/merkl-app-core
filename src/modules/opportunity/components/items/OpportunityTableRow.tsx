import AprModal from "@core/components/element/apr/AprModal";
import merklConfig from "@core/config";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import { OpportunityRow } from "@core/modules/opportunity/components/library/OpportunityTable";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Button, Dropdown, Group, Icon, Icons as IconGroup, Text, Title, Value, mergeClass } from "dappkit";
import { EventBlocker } from "dappkit";
import { useOverflowingRef } from "dappkit";
import { useMemo } from "react";

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
  const { name, tags, link, icons, Tags, Icons } = useOpportunityData(opportunity);
  const { rewardsBreakdown, formattedDailyRewards } = useOpportunityRewards(opportunity);

  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const aprColumn = useMemo(
    () => (
      <EventBlocker>
        <Dropdown size="xl" onHover content={<AprModal opportunity={opportunity} />}>
          <Text bold look="tint" size="lg">
            <Value value format={merklConfig.decimalFormat.apr}>
              {opportunity.apr / 100}
            </Value>
          </Text>
        </Dropdown>
      </EventBlocker>
    ),
    [opportunity],
  );

  const tvlColumn = useMemo(
    () => (
      <Text bold look="tint" size="lg">
        <Value value format={merklConfig.decimalFormat.dollar}>
          {opportunity.tvl ?? 0}
        </Value>
      </Text>
    ),
    [opportunity],
  );

  const rewardsColumn = useMemo(
    () => (
      <Group size="sm">
        <Text look="hype" bold size="lg">
          <Value value format={merklConfig.decimalFormat.dollar}>
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
            className={mergeClass("cursor-pointer ease hover:bg-main-2", className)}
            {...props}
            aprColumn={aprColumn}
            tvlColumn={tvlColumn}
            rewardsColumn={rewardsColumn}
            opportunityColumn={
              <Group className="flex-col w-full" size="lg">
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
                  <Tags tags={["chain", "protocol", "status", "action"]} size="xs" />
                </Group>
              </Group>
            }
            ctaColumn={
              <Button look="hype">
                <Icon remix="RiArrowRightLine" />
              </Button>
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
                  <Tags tags={["chain", "protocol", "status"]} size="sm" />
                </Group>
              </Group>
            }
          />
        );
    }
  }, [opportunity, aprColumn, tvlColumn, className, rewardsColumn, icons, overflowing, ref, tags]);

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{row}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {row}
    </Link>
  );
}
