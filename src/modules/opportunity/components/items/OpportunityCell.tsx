import type { TagTypes } from "@core/components/element/Tag";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity } from "@merkl/api";
import type { BoxProps } from "dappkit";
import { Box, Button, Divider, Group, Icon, Text, Title } from "dappkit";
import { useMemo } from "react";
import { Link } from "react-router";
import useOpportunityCell from "../../hooks/useOpportunityCell";

export type OpportunityCellProps = {
  opportunity: Opportunity;
  tags?: (keyof TagTypes)[];
  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({ opportunity, navigationMode, tags }: OpportunityCellProps) {
  const { name, link, Tags, Icons } = useOpportunityData(opportunity);
  const { opportunityMetrics } = useOpportunityCell(opportunity);

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-1 bg-main-2 ease !gap-0 h-full cursor-pointer !p-0">
        <Group className="p-xl flex-col flex-1">
          <Group className="flex-nowrap">
            <Text className="text-3xl">
              <Icons groupProps={{ className: "flex-nowrap" }} />
            </Text>
            <Title h={3} size={4}>
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
    [Icons, name, Tags, tags, opportunityMetrics],
  );

  const { track } = useMixpanelTracking();

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" onClick={() => track("Click on opportunity", { ...opportunity, view: "cell" })} to={link}>
      {cell}
    </Link>
  );
}
