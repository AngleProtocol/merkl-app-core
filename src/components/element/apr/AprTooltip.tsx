import type { Opportunity } from "@merkl/api";
import { Divider, Group, Icon, PrimitiveTag, Text, Title } from "dappkit";
import AprSection from "./AprSection";
import AprValue from "./AprValue";
import useOpportunityDistributionTypes from "@core/modules/opportunity/hooks/useOpportunityDistributionTypes";
import { useMemo } from "react";
import { DistributionType } from "@merkl/api/dist/database/api/.generated";
import { TvlSection } from "@core/index.generated";
import OpportunityAPRIcon from "@core/modules/opportunity/components/element/OpportunityAPRIcon";

type AprTooltipProps = {
  opportunity: Opportunity;
};

const titleFromDistributionType = (distributionType: DistributionType) => {
  switch (distributionType) {
    case DistributionType.DUTCH_AUCTION:
      return "Floating APR";
    case DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_VALUE:
      return "Fixed APR";
    case DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_VALUE:
      return "Fixed APR";
    default:
      return "APR";
  }
};

const descriptionFromDistributionType = (distributionType: DistributionType) => {
  switch (distributionType) {
    case DistributionType.DUTCH_AUCTION:
      return "A daily token budget is distributed in proportion to each depositor’s share of the total deposits.  The reward rate adjusts if more or fewer users join.";
    case DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_VALUE:
      return "You earn a stable annual rate (in $ value) on your deposit. Multiply by the days you stayed to see your total token yield.";
    case DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_VALUE:
      return "You earn a stable annual rate of reward tokens on your deposit. Multiply by the days you stayed to see your total token earnings.";
  }
};

const filterPerDistributionType = (distributionType: DistributionType, opportunity: Opportunity) => {
  return opportunity?.aprRecord?.breakdowns?.filter(
    breakdown =>
      breakdown.type === "CAMPAIGN" &&
      (breakdown as { distributionType: DistributionType }).distributionType === distributionType,
  );
};

const aprPerDistributionType = (distributionType: DistributionType, opportunity: Opportunity) => {
  return opportunity?.aprRecord?.breakdowns?.reduce((acc, breakdown) => {
    if (
      breakdown.type === "CAMPAIGN" &&
      (breakdown as { distributionType: DistributionType }).distributionType === distributionType
    ) {
      acc += breakdown.value;
    }
    return acc;
  }, 0);
};

export default function AprTooltip(props: AprTooltipProps) {
  const { opportunity } = props;
  const { distributionTypes } = useOpportunityDistributionTypes(opportunity);

  const title = useMemo(() => {
    if (distributionTypes.size === 1) return titleFromDistributionType([...distributionTypes][0]).toUpperCase();

    return "APR";
  }, [distributionTypes]);

  const description = useMemo(() => {
    if (distributionTypes.size === 1) return descriptionFromDistributionType([...distributionTypes][0]);

    if (distributionTypes.size >= 1)
      return "This opportunity has multiple campaigns with different APR types. The total APR reflects all campaigns added together.";

    return "AVERAGE APR";
  }, [distributionTypes]);

  return (
    <Group className="flex-col lg:max-w-[30vw]" size="xl">
      <Group className="justify-between items-center">
        <Group className="flex items-center gap-md">
          <OpportunityAPRIcon opportunity={opportunity} floatingAPRIcon size="lg" />
          <Title look="soft" h={5}>
            AVERAGE {title}
          </Title>
        </Group>
        <PrimitiveTag look="tint" size="md">
          <AprValue value>{opportunity.apr}</AprValue>
        </PrimitiveTag>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="md">
        {description && (
          <Group className="p-md">
            <Text size="xs" look="soft">
              {description}
            </Text>
          </Group>
        )}
        {distributionTypes.size === 1 ? (
          <AprSection
            breakdowns={opportunity?.aprRecord?.breakdowns?.filter(breakdown => breakdown.type !== "PROTOCOL")}
          />
        ) : (
          <Group className="flex-col" size="md">
            {distributionTypes.size >= 1
              ? [...distributionTypes.keys()].map(distributionType => {
                  return (
                    <Group key={distributionType} className="flex-col">
                      <Group className="justify-between items-center">
                        <Group>
                          <Icon remix="RiFileList3Line" className="text-main-11" />
                          <Text look="soft" size="lg" bold>
                            {titleFromDistributionType(distributionType)} details
                          </Text>
                        </Group>
                        <PrimitiveTag look="bold" size="md">
                          <AprValue value>{aprPerDistributionType(distributionType, opportunity)}</AprValue>
                        </PrimitiveTag>
                      </Group>
                      <Divider />
                      <Group className="p-md">
                        <Text size="xs" look="soft">
                          {descriptionFromDistributionType(distributionType)}
                        </Text>
                      </Group>

                      <AprSection breakdowns={filterPerDistributionType(distributionType, opportunity)} />
                    </Group>
                  );
                })
              : null}
          </Group>
        )}
      </Group>
      <TvlSection opportunity={opportunity} />
    </Group>
  );
}
