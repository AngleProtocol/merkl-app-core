import Tag from "@core/components/element/Tag";
import AprSectionCampaigns from "@core/components/element/apr/AprSectionCampaigns";
import TvlRowAllocation from "@core/components/element/tvl/TvlRowAllocation";
import useParticipate from "@core/hooks/useParticipate";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Dropdown, Group, Icon, Text, Title, Value } from "packages/dappkit/src";
import React, { useCallback, useMemo } from "react";
import useOpportunityMetadata from "../../hooks/useOpportunityMetadata";
import OpportunityParticipateModal from "./OpportunityParticipateModal";

type IProps = {
  opportunity: Opportunity;
  className?: string;
};

export default function OpportunityBoxParticipate(props: IProps) {
  const { opportunity, className } = props;
  const [isSupplyModalOpen, setSupplyModalOpen] = React.useState<boolean>(false);

  const { targets } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier);

  const isDepositEnabled = useMerklConfig(store => store.config.deposit);
  const decimalFormatDolar = useMerklConfig(store => store.config.decimalFormat.dollar);
  const decimalFormatApr = useMerklConfig(store => store.config.decimalFormat.apr);
  const { url: protocolUrl } = useOpportunityMetadata(opportunity);

  const isSupplyButtonVisible = useMemo(() => {
    if (!!targets) return true;
    if (!protocolUrl) return false;
    return true;
  }, [protocolUrl, targets]);

  const onSupply = useCallback(() => {
    if ((!isDepositEnabled && !!protocolUrl) || !targets) return window.open(protocolUrl, "_blank");
    setSupplyModalOpen(true);
  }, [protocolUrl, targets, isDepositEnabled]);

  return (
    <>
      <OpportunityParticipateModal opportunity={opportunity} state={[isSupplyModalOpen, setSupplyModalOpen]} />
      <Box
        className={`bg-main-0 w-full !gap-0 h-[fit-content] border-1 border-accent-5 overflow-hidden ${className} !p-0`}
        size="xl">
        <Group className="justify-between flex-nowrap h-[fit-content] p-xl w-full items-center">
          <Text bold look="hype">
            OPPORTUNITY
          </Text>
          <Tag type="status" value={opportunity.status} size="md" />
        </Group>

        <Group className="flex-col bg-main-4 p-xl w-full justify-between" size="sm">
          <Text bold className="flex items-center gap-sm w-full" look="tint">
            <Icon remix="RiStarFill" className="fill-accent-10" />
            Daily Rewards
          </Text>
          <Group className="items-center justify-between">
            <Title look="hype" h={3}>
              <Value value format={decimalFormatDolar}>
                {opportunity.dailyRewards}
              </Value>
            </Title>
            {!!isSupplyButtonVisible && (
              <Button className="inline-flex" look="hype" size="xl" onClick={onSupply}>
                Supply
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
          </Group>
        </Group>

        <Group className="p-xl h-[fit-content] w-full justify-between flex-col gap-xl">
          <Group className="justify-between items-center">
            <Text size={"sm"}> Details </Text>
            <Group className="gap-sm">
              <Tag type="chain" value={opportunity.chain} size="xs" />
              <Tag type="protocol" value={opportunity.protocol} size="xs" />
            </Group>
          </Group>
          <Group className="flex-nowrap">
            <Group className="border-1 rounded-lg border-main-9 p-lg flex-col flex-1" size="sm">
              <Dropdown onHover content={<AprSectionCampaigns opportunity={opportunity} />}>
                <Text bold className="flex items-center gap-sm ">
                  APR
                  <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                </Text>
              </Dropdown>

              <Title h={3} look="tint">
                <Value value format={decimalFormatApr}>
                  {opportunity.apr / 100}
                </Value>
              </Title>
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
        </Group>
      </Box>
    </>
  );
}
