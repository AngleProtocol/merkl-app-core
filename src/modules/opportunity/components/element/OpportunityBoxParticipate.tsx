import Tag from "@core/components/element/Tag";
import AprSectionCampaigns from "@core/components/element/apr/AprSectionCampaigns";
import PointsModalCampaigns from "@core/components/element/points/PointsModalCampaigns";
import TvlRowAllocation from "@core/components/element/tvl/TvlRowAllocation";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { Box, Button, Dropdown, Group, Icon, Text, Title, Value } from "packages/dappkit/src";
import React, { useCallback, useMemo } from "react";
import useOpportunityMetadata from "../../hooks/useOpportunityMetadata";
import useOpportunityRewards from "../../hooks/useOpportunityRewards";
import OpportunityParticipateModal from "./OpportunityParticipateModal";

export interface OpportunityBoxParticipateProps {
  opportunity: Opportunity;
  targets?: InteractionTarget[];
  className?: string;
}

export default function OpportunityBoxParticipate(props: OpportunityBoxParticipateProps) {
  const { opportunity, className, targets } = props;
  const [isSupplyModalOpen, setSupplyModalOpen] = React.useState<boolean>(false);

  const isDepositEnabled = useMerklConfig(store => store.config.deposit);
  const decimalFormatDolar = useMerklConfig(store => store.config.decimalFormat.dollar);
  const decimalFormatApr = useMerklConfig(store => store.config.decimalFormat.apr);
  const decimalFormatPoint = useMerklConfig(store => store.config.decimalFormat.point);

  const { url: protocolUrl } = useOpportunityMetadata(opportunity);
  const { isOnlyPoint, pointAggregation } = useOpportunityRewards(opportunity);

  const isSupplyButtonVisible = useMemo(() => {
    if (!!isDepositEnabled && !!targets) return true;
    if (!isDepositEnabled && !protocolUrl) return false;
    return true;
  }, [protocolUrl, targets, isDepositEnabled]);

  const onSupply = useCallback(() => {
    if ((!isDepositEnabled || !targets) && protocolUrl) return window.open(protocolUrl, "_blank");
    setSupplyModalOpen(true);
  }, [protocolUrl, targets, isDepositEnabled]);

  return (
    <>
      <OpportunityParticipateModal {...{ opportunity, targets }} state={[isSupplyModalOpen, setSupplyModalOpen]} />
      <Box
        className={`bg-main-0 w-full !gap-0 h-[fit-content] border-1 border-accent-5 overflow-hidden ${className} !p-0`}
        size="xl">
        <Group className="items-center flex-nowrap bg-main-4 py-xl*2 p-xl w-full justify-between" size="sm">
          <Text size="md" bold className="uppercase flex items-center gap-sm w-full" look="hype">
            <Icon remix="RiStarFill" />
            Daily Rewards
          </Text>
          <Group className="items-center justify-between">
            <Title look="hype" h={3}>
              {isOnlyPoint ? (
                <>
                  <Value value format={decimalFormatPoint}>
                    {pointAggregation!}
                  </Value>
                </>
              ) : (
                <Value value format={decimalFormatDolar}>
                  {opportunity.dailyRewards}
                </Value>
              )}
            </Title>
          </Group>
        </Group>

        <Group className="p-xl py-lg*2  h-[fit-content] w-full justify-between flex-col gap-xl">
          <Group className="justify-between items-center">
            <Text size={"sm"}> Details </Text>
            <Group className="gap-sm">
              <Tag type="chain" value={opportunity.chain} size="xs" />
              <Tag type="protocol" value={opportunity.protocol} size="xs" />
            </Group>
          </Group>
          <Group size="lg" className="flex-nowrap">
            <Group className="border-1 rounded-lg border-main-9 p-lg flex-col flex-1" size="sm">
              <Dropdown
                onHover
                content={
                  isOnlyPoint ? (
                    <PointsModalCampaigns opportunity={opportunity} />
                  ) : (
                    <AprSectionCampaigns opportunity={opportunity} />
                  )
                }>
                <Text bold className="flex items-center gap-sm ">
                  {isOnlyPoint ? "SCORE" : "APR"}
                  <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                </Text>
              </Dropdown>

              <Title h={3} look="tint">
                {isOnlyPoint ? (
                  <Value value format={decimalFormatPoint}>
                    {opportunity.apr}
                  </Value>
                ) : (
                  <Value value format={decimalFormatApr}>
                    {opportunity.apr / 100}
                  </Value>
                )}
              </Title>
              <Text size={"xs"}>{isOnlyPoint && "/per $ per day"}</Text>
            </Group>
            <Group className="border-1 rounded-lg border-main-9 p-lg flex-col flex-1" size="sm">
              {opportunity.type === "CLAMM" ? (
                <Dropdown onHover content={<TvlRowAllocation opportunity={opportunity} />}>
                  <Text bold className="flex items-center gap-sm " look="soft">
                    TVL
                    <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                  </Text>
                </Dropdown>
              ) : (
                <Text bold className="flex items-center gap-sm ">
                  TVL
                </Text>
              )}
              <Title h={3} look="tint">
                <Value value format={decimalFormatDolar}>
                  {opportunity.tvl}
                </Value>
              </Title>
            </Group>
          </Group>
          {!!isSupplyButtonVisible && (
            <Button className="inline-flex justify-center" look="hype" size="xl" onClick={onSupply}>
              Supply Liquidity
              {(!targets || !isDepositEnabled) && <Icon remix="RiArrowRightUpLine" size="sm" />}
            </Button>
          )}
        </Group>
      </Box>
    </>
  );
}
