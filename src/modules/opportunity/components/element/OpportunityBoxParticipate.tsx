import Tag from "@core/components/element/Tag";
import merklConfig from "@core/config";
import useParticipate from "@core/hooks/useParticipate";
import type { Opportunity } from "@merkl/api";
import { Button, Dropdown, Group, Icon, Text, Value } from "packages/dappkit/src";
import useOpportunityMetadata from "../../hooks/useOpportunityMetadata";
import React, { useCallback, useMemo } from "react";
import OpportunityParticipateModal from "./OpportunityParticipateModal";
import TvlRowAllocation from "@core/components/element/tvl/TvlRowAllocation";
import AprSectionCampaigns from "@core/components/element/apr/AprSectionCampaigns";

type IProps = {
  opportunity: Opportunity;
  className?: string;
};

export default function OpportunityBoxParticipate(props: IProps) {
  const { opportunity, className } = props;
  const [isSupplyModalOpen, setSupplyModalOpen] = React.useState<boolean>(false);

  const { targets } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier);

  const { url: protocolUrl } = useOpportunityMetadata(opportunity);

  const isSupplyButtonVisible = useMemo(() => {
    if (!!targets) return true;
    if (!protocolUrl) return false;
    return true;
  }, [protocolUrl, targets]);

  const onSupply = useCallback(() => {
    if ((!merklConfig.deposit && !!protocolUrl) || !targets) return window.open(protocolUrl, "_blank");
    setSupplyModalOpen(true);
  }, [protocolUrl, targets]);

  return (
    <>
      <OpportunityParticipateModal opportunity={opportunity} state={[isSupplyModalOpen, setSupplyModalOpen]} />
      <Group
        className={`w-full !gap-0 h-[fit-content] border-1 rounded-lg border-accent-5 overflow-hidden ${className}`}>
        <Group className="justify-between flex-nowrap h-[fit-content] bg-main-2 p-xl w-full">
          <Text>{"Opportunity".toUpperCase()}</Text>
          <Tag type="status" value={opportunity.status} size="xs" />
        </Group>

        <Group className="flex-col bg-accent-4 p-xl w-full justify-between" size="xs">
          <Text bold className="flex items-center gap-sm w-full">
            <Icon remix="RiStarFill" className="fill-accent-10" />
            DAILY REWARDS
          </Text>
          <Group className="items-center justify-between">
            <Text bold look="tint" size={"xl"}>
              <Value value format={merklConfig.decimalFormat.dollar}>
                {opportunity.dailyRewards}
              </Value>
            </Text>
            {!!isSupplyButtonVisible && (
              <Button className="inline-flex" look="hype" size="md" onClick={onSupply}>
                Supply
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
          </Group>
        </Group>

        <Group className="bg-main-2 p-xl h-[fit-content] w-full justify-between flex-col gap-xl">
          <Group className="justify-between items-center">
            <Text> DETAILS </Text>
            <Group className="gap-sm">
              <Tag type="chain" value={opportunity.chain} size="xs" />
              <Tag type="protocol" value={opportunity.protocol} size="xs" />
            </Group>
          </Group>
          <Group className="flex-nowrap">
            <Group className="border-1 rounded-lg border-accent-10 p-lg flex-col flex-1" size="xs">
              <Dropdown onHover content={<AprSectionCampaigns opportunity={opportunity} />}>
                <Text bold className="flex items-center gap-sm ">
                  APR
                  <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                </Text>
              </Dropdown>

              <Text bold look="tint" size={"xl"}>
                <Value value format={merklConfig.decimalFormat.apr}>
                  {opportunity.apr / 100}
                </Value>
              </Text>
            </Group>
            <Group className="border-1 rounded-lg border-accent-10 p-lg flex-col flex-1" size="xs">
              {opportunity.type === "CLAMM" ? (
                <Dropdown onHover content={<TvlRowAllocation opportunity={opportunity} />}>
                  <Text bold className="flex items-center gap-sm ">
                    TVL
                    <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                  </Text>
                </Dropdown>
              ) : (
                <Text bold className="flex items-center gap-sm ">
                  TVL
                </Text>
              )}
              <Text bold look="tint" size={"xl"}>
                <Value value format={merklConfig.decimalFormat.dollar}>
                  {opportunity.tvl}
                </Value>
              </Text>
            </Group>
          </Group>
        </Group>
      </Group>
    </>
  );
}
