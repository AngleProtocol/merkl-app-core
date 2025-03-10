import EtherScan from "@core/assets/images/etherscan.svg";
import Tag from "@core/components/element/Tag";
import useCampaignMetadata from "@core/modules/campaigns/hooks/useCampaignMetadata";
import useCampaignRules from "@core/modules/campaigns/hooks/useCampaignRules";
import type { Campaign, Chain as ChainType } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import {
  Box,
  Button,
  type Component,
  Dropdown,
  EventBlocker,
  Group,
  Hash,
  Icon,
  Image,
  OverrideTheme,
  PrimitiveTag,
  Space,
  Text,
  mergeClass,
} from "dappkit";
import { Collapsible } from "dappkit";
import { Time } from "dappkit";
import { Tooltip } from "dappkit";
import moment from "moment";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useChain from "../../../chain/hooks/useChain";
import Token from "../../../token/components/element/Token";
import CampaignTooltipDates from "../CampaignTooltipDates";
import { CampaignRow } from "../library/CampaignTable";
import Rule from "../rules/Rule";
import { useNavigate } from "@remix-run/react";

export type CampaignTableRowProps = Component<{
  campaign: Campaign;
  opportunity?: Opportunity;
  startsOpen?: boolean;
  chain: ChainType;
  size?: Parameters<typeof CampaignRow>["0"]["size"];
}>;

export default function CampaignTableRow({
  campaign,
  opportunity,
  startsOpen,
  className,
  chain,
  size,
  ...props
}: CampaignTableRowProps) {
  const { time, dailyRewards, active, amount } = useCampaignMetadata(campaign);
  const { chain: distributionChain } = useChain(campaign.distributionChain);
  const { rules } = useCampaignRules(campaign, opportunity);
  const [isOpen, setIsOpen] = useState(startsOpen);

  const navigate = useNavigate();

  const toggleIsOpen = useCallback(() => setIsOpen(o => !o), []);

  const onNavigateToLeaderBoard = useCallback(() => {
    navigate(`leaderboard?campaignId=${campaign.campaignId}`);
  }, [campaign.campaignId, navigate]);

  const campaignInformation = useMemo(() => {
    const columns = [
      [
        "Total Distributed",
        <Token key="token" size="xs" token={campaign.rewardToken} amount={amount} format="amount_price" />,
      ],
      ["Reward chain", <Tag key="chain" type="chain" value={distributionChain ?? chain} size="xs" />],
      [
        "Last Snapshot",
        <Tooltip
          helper={
            "Indicates when the campaign has last been processed by the Merkl engine. Once a campaign is processed, its rewards can then be included in the following distribution of the associated chain. Distributions on a chain may easily be delayed, for example by disputers, or by instabilities in Merkl dependencies"
          }
          key="computedUntil">
          <Text size="sm" look="tint">
            {campaign?.campaignStatus?.computedUntil ? (
              <Time timestamp={Number(campaign?.campaignStatus?.computedUntil) * 1000} />
            ) : (
              "Never"
            )}
          </Text>
        </Tooltip>,
      ],
      [
        "Dates",
        <Dropdown key="dates" content={<CampaignTooltipDates campaign={campaign} />}>
          <Text size="sm" className="flex" look="tint">
            {moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY")}
            <Icon remix="RiArrowRightLine" />
            {moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY")}
          </Text>
        </Dropdown>,
      ],
      [
        "Creator address",
        <Group key="creator" className="gap-xs">
          <Hash size="sm" format="short" copy look="tint">
            {campaign.creatorAddress}
          </Hash>
          <Button to={`${chain.explorers?.[0]?.url}/address/${campaign.creatorAddress}`} external size="xs" look="soft">
            <Image className="w-3" alt="Merkl Footer logo" src={EtherScan} />
          </Button>
        </Group>,
      ],
      [
        <EventBlocker key="leaderboardLabel">
          <Text size="sm" className="flex items-center gap-xs" onClick={onNavigateToLeaderBoard}>
            Leaderboard
            <Icon remix="RiArrowRightUpLine" />
          </Text>
        </EventBlocker>,
        <Text key="leaderboard" size={"sm"} look="tint">
          Todo
        </Text>,
      ],
      rules.length > 0
        ? [
            <Text key="rules" size="sm">
              Rules
            </Text>,
            <EventBlocker key="rulesLabel">
              <Group className="justify-between flex-col size-full">
                <Group>
                  {rules?.map(rule => (
                    <Rule size="xs" key={uuidv4()} type={rule.type} value={rule.value} />
                  ))}
                </Group>
              </Group>
            </EventBlocker>,
          ]
        : [undefined, undefined],
    ] as const satisfies [ReactNode, ReactNode][];

    return columns.map(([label, content]) => {
      return (
        <Group key={label?.toString()} className="justify-between">
          <Text size="sm">{label}</Text>
          {content}
        </Group>
      );
    });
  }, [campaign, amount, chain, distributionChain, onNavigateToLeaderBoard, rules]);

  const isCampaignLive = useMemo(() => BigInt(campaign.endTimestamp) * 1000n > moment.now(), [campaign]);

  return (
    <CampaignRow
      {...props}
      size={size}
      className={mergeClass("cursor-pointer py-4", className)}
      onClick={toggleIsOpen}
      dailyRewardsColumn={
        <Group className="align-middle items-center flex-nowrap">
          <OverrideTheme accent={"good"}>
            <Icon className={active ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" />
          </OverrideTheme>
          <Text bold className="flex-nowrap gap-xs items-center whitespace-nowrap">
            CAMPAIGN #
            <Hash size="sm" format="prefix" copy bold>
              {campaign.campaignId}
            </Hash>
          </Text>
          <Token
            size="sm"
            token={campaign.rewardToken}
            amount={dailyRewards}
            format="amount_price"
            chain={distributionChain}
          />
          <Icon
            data-state={!isOpen ? "closed" : "opened"}
            className="transition duration-150 ease-out data-[state=opened]:rotate-180 border-1 border-accent-10 rounded-full p-1"
            remix={"RiArrowDropDownLine"}
          />
        </Group>
      }
      timeRemainingColumn={
        <PrimitiveTag look={isCampaignLive ? "bold" : "soft"} size="xs" coloring={isCampaignLive ? "good" : undefined}>
          {isCampaignLive && <Icon remix="RiFlashlightFill" />}
          {time}
        </PrimitiveTag>
      }>
      <Collapsible state={[isOpen, setIsOpen]}>
        <Space size="md" />
        <Box size="md" className="p-0 bg-main-4 !rounded-md">
          <Group className="flex-nowrap p-lg" size="lg">
            <Group className="justify-between flex-grow flex-col size-full gap-xs">
              <Text size="sm" look="tint" bold className="mb-md">
                Campaign Informations
              </Text>
              {campaignInformation}
            </Group>
          </Group>
        </Box>
      </Collapsible>
    </CampaignRow>
  );
}
