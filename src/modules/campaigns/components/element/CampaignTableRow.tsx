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
  Divider,
  Dropdown,
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
import useChain from "../../../chain/hooks/useChain";
import Token from "../../../token/components/element/Token";
import CampaignTooltipDates from "../CampaignTooltipDates";
import { CampaignRow } from "../library/CampaignTable";
import Rule from "../rules/Rule";

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

  const toggleIsOpen = useCallback(() => setIsOpen(o => !o), []);

  const campaignInformation = useMemo(() => {
    const columns = [
      [
        "Total Distributed",
        <Token
          key="token"
          symbol={false}
          size="md"
          token={campaign.rewardToken}
          amount={amount}
          format="amount_price"
        />,
      ],
      [
        "Dates",
        <Dropdown key="dates" content={<CampaignTooltipDates campaign={campaign} />}>
          <Text size="sm" className="flex">
            {moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY")}
            <Icon remix="RiArrowRightLine" />
            {moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY")}
          </Text>
        </Dropdown>,
      ],
      [
        "Campaign Creator",
        <Group key="creator" className="gap-xs">
          <Hash size="sm" format="short" copy>
            {campaign.creatorAddress}
          </Hash>
          <Button to={`${chain.explorers?.[0]?.url}/address/${campaign.creatorAddress}`} external size="xs" look="soft">
            <Image className="w-3" alt="Merkl Footer logo" src={EtherScan} />
          </Button>
        </Group>,
      ],
      [
        "Merkl Campaign Id",
        <Hash key="id" size="sm" format="short" copy>
          {campaign.campaignId}
        </Hash>,
      ],
      [
        "Last Snapshot",
        <Tooltip
          helper={
            "Indicates when the campaign has last been processed by the Merkl engine. Once a campaign is processed, its rewards can then be included in the following distribution of the associated chain. Distributions on a chain may easily be delayed, for example by disputers, or by instabilities in Merkl dependencies"
          }
          key="computedUntil">
          <Text>
            {campaign?.campaignStatus?.computedUntil ? (
              <Time timestamp={Number(campaign?.campaignStatus?.computedUntil) * 1000} />
            ) : (
              "Never"
            )}
          </Text>
        </Tooltip>,
      ],
    ] as const satisfies [string, ReactNode][];

    return columns.map(([label, content]) => {
      return (
        <Group key={label} className="justify-between">
          <Text size="sm" look="bold">
            {label}
          </Text>
          {content}
        </Group>
      );
    });
  }, [campaign, amount, chain]);

  const isCampaignLive = useMemo(() => BigInt(campaign.endTimestamp) * 1000n > moment.now(), [campaign]);

  return (
    <CampaignRow
      {...props}
      size={size}
      className={mergeClass("cursor-pointer py-4", className)}
      onClick={toggleIsOpen}
      chainColumn={distributionChain && <Tag type="chain" value={distributionChain} />}
      dailyRewardsColumn={
        <Group className="align-middle items-center flex-nowrap">
          <OverrideTheme accent={"good"}>
            <Icon className={active ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" />
          </OverrideTheme>
          <Token
            size="xl"
            token={campaign.rewardToken}
            amount={dailyRewards}
            format="amount_price"
            chain={distributionChain}
          />
          <Icon
            data-state={!isOpen ? "closed" : "opened"}
            className="transition duration-150 ease-out data-[state=opened]:rotate-180"
            remix={"RiArrowDropDownLine"}
          />
        </Group>
      }
      timeRemainingColumn={
        <PrimitiveTag look={isCampaignLive ? "bold" : "soft"}>
          {isCampaignLive && <Icon remix="RiFlashlightFill" />}
          {time}
        </PrimitiveTag>
      }>
      <Collapsible state={[isOpen, setIsOpen]}>
        <Space size="md" />
        <Box size="md" className="p-0 bg-main-4 !rounded-md">
          <Group className="flex-nowrap p-lg" size="lg">
            <Group className="justify-between flex-grow flex-col size-full">
              <Text size="sm" look="soft">
                Campaign Information
              </Text>
              {campaignInformation}
            </Group>
            <Divider look="bold" vertical className="bg-main-6 border-main-6" />
            <Group className="justify-between flex-col size-full">
              <Group className="flex justify-between item-center">
                <Text size="sm" look="soft">
                  Rules
                </Text>
              </Group>
              <Group>
                {rules?.map(rule => (
                  <Rule size="md" key={`${rule.type}_${rule.value.label}`} type={rule.type} value={rule.value} />
                ))}
              </Group>
            </Group>
          </Group>
        </Box>
      </Collapsible>
    </CampaignRow>
  );
}
