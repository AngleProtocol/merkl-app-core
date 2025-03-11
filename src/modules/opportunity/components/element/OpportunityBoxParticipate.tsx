import Tag from "@core/components/element/Tag";
import AprSectionCampaigns from "@core/components/element/apr/AprSectionCampaigns";
import TvlRowAllocation from "@core/components/element/tvl/TvlRowAllocation";
import merklConfig from "@core/config";
import useParticipate from "@core/hooks/useParticipate";
import type { Opportunity } from "@merkl/api";
import { Button, Dropdown, Group, Icon, Text, Title, Value } from "packages/dappkit/src";
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
        <Group className="justify-between flex-nowrap h-[fit-content] bg-main-2 p-xl w-full items-center">
          <Title h={5} look="hype" className="!text-sm">
            OPPORTUNITY
          </Title>
          <Tag type="status" value={opportunity.status} size="md" />
        </Group>

        <Group className="flex-col bg-main-4 p-xl w-full justify-between" size="sm">
          <Text bold className="flex items-center gap-sm w-full" look="tint">
            <Icon remix="RiStarFill" className="fill-accent-10" />
            Daily Rewards
          </Text>
          <Group className="items-center justify-between">
            <Title look="hype" h={3}>
              <Value value format={merklConfig.decimalFormat.dollar}>
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

        <Group className="bg-main-2 p-xl h-[fit-content] w-full justify-between flex-col gap-xl">
          <Group className="justify-between items-center">
            <Text size={"sm"}> Details </Text>
            <Group className="gap-sm">
              <Tag type="chain" value={opportunity.chain} size="xs" />
              <Tag type="protocol" value={opportunity.protocol} size="xs" />
            </Group>
          </Group>
          <Group className="flex-nowrap">
            <Group className="border-1 rounded-lg border-accent-10 p-lg flex-col flex-1" size="sm">
              <Dropdown onHover content={<AprSectionCampaigns opportunity={opportunity} />}>
                <Text bold className="flex items-center gap-sm ">
                  APR
                  <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
                </Text>
              </Dropdown>

              <Title h={3} look="tint">
                <Value value format={merklConfig.decimalFormat.apr}>
                  {opportunity.apr / 100}
                </Value>
              </Title>
            </Group>
            <Group className="border-1 rounded-lg border-accent-10 p-lg flex-col flex-1" size="sm">
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
                <Value value format={merklConfig.decimalFormat.dollar}>
                  {opportunity.tvl}
                </Value>
              </Title>
            </Group>
          </Group>
        </Group>
      </Group>
    </>
  );
}
