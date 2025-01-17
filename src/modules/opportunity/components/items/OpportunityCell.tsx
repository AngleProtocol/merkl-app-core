import type { TagTypes } from "@core/components/element/Tag";
import AprModal from "@core/components/element/apr/AprModal";
import type { OpportunityNavigationMode } from "@core/config/opportunity";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import {
  Box,
  Button,
  Divider,
  Dropdown, Group,
  Icon,
  PrimitiveTag,
  Text,
  Title,
  Value,
  mergeClass,
  useOverflowingRef
} from "dappkit";
import { useMemo } from "react";

export type OpportunityCellProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;

  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({
  opportunity,
  hideTags,
  navigationMode,
}: OpportunityCellProps) {
  const { name, link, Tags, Icons } = useOpportunityData(opportunity);
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-2 bg-main-3 ease !gap-0 h-full cursor-pointer">
        <Group className="p-xl justify-between items-end">
          <Group className="flex-col">
            <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group>
            <Text bold look="bold">
              Total daily rewards
            </Text>
          </Group>

          <Dropdown size="xl" content={<AprModal opportunity={opportunity} />}>
            <PrimitiveTag look="hype" size="lg">
              <Value value format="0a%">
                {opportunity.apr / 100}
              </Value>{" "}
              <span className="font-normal">APR</span>
            </PrimitiveTag>
          </Dropdown>
        </Group>
        <Divider className="my-0" look="soft" />
        <Group className="flex-col p-xl flex-1">
          <Group className="justify-between flex-col flex-1">
            <Group className="flex-nowrap">
              <Text className="text-3xl">
                <Icons groupProps={{ className: "flex-nowrap" }} />
              </Text>
              <Title
                h={3}
                size={4}
                ref={ref}
                className={mergeClass(
                  "font-medium [overflow-wrap:anywhere]",
                  overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                )}>
                {name}
              </Title>
            </Group>

            <Group className="justify-between flex-nowrap">
              <Group className="items-center">
                <Tags hide={hideTags} size="sm" />
              </Group>
              <Group className="flex-col justify-end">
                <Button className="hidden lg:block" look="base">
                  <Icon remix="RiArrowRightLine" />
                </Button>
              </Group>
            </Group>
          </Group>
        </Group>
      </Box>
    ),
    [opportunity, Icons, name, overflowing, ref, Tags, hideTags, formattedDailyRewards],
  );

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
