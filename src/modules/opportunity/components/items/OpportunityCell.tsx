import type { TagTypes } from "@core/components/element/Tag";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Box, Button, Divider, Group, Icon, Text, Title, mergeClass, useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import useOpportunityCell from "../../hooks/useOpportunityCell";

export type OpportunityCellProps = {
  opportunity: Opportunity;
  tags?: (keyof TagTypes)[];
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({ opportunity, navigationMode, tags }: OpportunityCellProps) {
  const { name, link, Tags, Icons } = useOpportunityData(opportunity);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();
  const { opportunityMetrics } = useOpportunityCell(opportunity);

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
          <Group className="flex-col" size="xs">
            {Object.values(opportunityMetrics ?? {})}
          </Group>

          <Group className="flex-col justify-end">
            <Button look="hype" size="lg">
              Explore
              <Icon remix="RiArrowRightLine" />
            </Button>
          </Group>
        </Group>
      </Box>
    ),
    [Icons, name, overflowing, ref, Tags, tags, opportunityMetrics],
  );

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
