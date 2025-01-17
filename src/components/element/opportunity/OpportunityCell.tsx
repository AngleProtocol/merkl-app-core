import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import {
  Box,
  Button,
  Divider,
  Dropdown,
  Fmt,
  Group,
  Icon,
  Icons,
  PrimitiveTag,
  Text,
  Title,
  Value,
  mergeClass,
  useOverflowingRef,
} from "dappkit";
import { useMemo } from "react";
import merklConfig from "../../../config";
import type { OpportunityNavigationMode } from "../../../config/opportunity";
import useOpportunity from "../../../hooks/resources/useOpportunity";
import type { Opportunity } from "../../../modules/opportunity/opportunity.model";
import Tag, { type TagTypes } from "../Tag";
import AprModal from "../apr/AprModal";
import OpportunityParticipateModal from "./OpportunityParticipateModal";

export type OpportunityCellProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;

  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({
  opportunity: opportunityRaw,
  hideTags,
  navigationMode,
}: OpportunityCellProps) {
  const { tags, link, icons, opportunity } = useOpportunity(opportunityRaw);

  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const renderDailyRewards = useMemo(() => {
    if (merklConfig.opportunity.library.dailyRewardsTokenAddress) {
      const breakdowns = opportunity.rewardsRecord.breakdowns.filter(breakdown => {
        return breakdown?.token.address === merklConfig.opportunity.library.dailyRewardsTokenAddress;
      });
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => {
        return BigInt(acc) + BigInt(breakdown.amount);
      }, 0n);
      return (
        <>
          <Title h={3} size={3} look="soft">
            <Value value format={"0,0.##a"}>
              {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
            </Value>

            {` ${token?.symbol ?? ""}`}
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

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-2 bg-main-3 ease !gap-0 h-full cursor-pointer">
        <Group className="p-xl justify-between items-end">
          <Group className="flex-col">
            <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{renderDailyRewards}</Group>
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
                <Icons className="flex-nowrap">{icons}</Icons>
              </Text>
              <Title
                h={3}
                size={4}
                ref={ref}
                className={mergeClass(
                  "font-medium [overflow-wrap:anywhere]",
                  overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                )}>
                {opportunity.name}
              </Title>
            </Group>

            <Group className="justify-between flex-nowrap">
              <Group className="items-center">
                {tags
                  ?.filter(a => a !== undefined)
                  ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                  .map(tag => (
                    <Tag filter key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="sm" />
                  ))}
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
    [opportunity, overflowing, ref, icons, tags, hideTags, renderDailyRewards],
  );

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
