import type { TagTypes } from "@core/components/element/Tag";
import config from "@core/config";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Box, Button, Divider, Group, Icon, Text, Title, Value, mergeClass, useOverflowingRef } from "dappkit";
import { useMemo } from "react";

export type OpportunityCellProps = {
  opportunity: Opportunity;
  tags?: (keyof TagTypes)[];
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({ opportunity, navigationMode, tags }: OpportunityCellProps) {
  const { name, link, Tags, Icons } = useOpportunityData(opportunity);
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-1 bg-main-2 ease !gap-0 h-full cursor-pointer !p-0">
        <Group className="p-md md:p-xl justify-between flex-1 items-end">
          <Group className="flex-nowrap">
            <Text className="text-3xl">
              <Icons groupProps={{ className: "flex-nowrap" }} />
            </Text>
            <Title
              h={3}
              size={4}
              ref={ref}
              className={mergeClass(
                "[overflow-wrap:anywhere]",
                overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
              )}>
              {name}
            </Title>
          </Group>
          <Group className="justify-between flex-nowrap">
            <Group className="items-center">
              <Tags tags={tags ?? ["chain", "protocol", "action"]} size="xs" />
            </Group>
          </Group>
        </Group>
        <Divider className="my-0" look="soft" />
        <Group className="flex-nowrap p-md md:p-xl justify-between">
          <div>
            <Group className="flex-nowrap items-center" size="sm">
              <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
              <Text bold look="soft">
                Daily Rewards
              </Text>
            </Group>

            <Group className="items-center">
              <Value value format="0a%">
                {opportunity.apr / 100}
              </Value>{" "}
              APR
            </Group>
            <Text look="base">
              <Value value format={config.decimalFormat.dollar}>
                {opportunity.tvl ?? 0}
              </Value>{" "}
              TVL
            </Text>
          </div>

          <Group className="flex-col justify-end">
            <Button look="hype" size="lg">
              Explore
              <Icon remix="RiArrowRightLine" />
            </Button>
          </Group>
        </Group>
      </Box>
    ),
    [opportunity, Icons, name, overflowing, ref, Tags, tags, formattedDailyRewards],
  );

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
