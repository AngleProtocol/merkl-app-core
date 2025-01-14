import { Box, Button, Group, Icon, Icons, Text, Title, Value } from "dappkit";
import { Fmt } from "dappkit";
import config from "merkl.config";
import { useMemo } from "react";
import useOpportunity from "../../../hooks/resources/useOpportunity";
import type { Opportunity } from "../../../modules/opportunity/opportunity.model";
import Tag from "../Tag";

export type OpportunityShortCardProps = { opportunity: Opportunity; displayLinks?: boolean };

export default function OpportunityShortCard({ opportunity, displayLinks }: OpportunityShortCardProps) {
  const { icons, rewardIcons, tags } = useOpportunity(opportunity);

  const visitUrl = useMemo(() => {
    if (!!opportunity.depositUrl) return opportunity.depositUrl;
    if (!!opportunity.protocol?.url) return opportunity.protocol?.url;
  }, [opportunity]);

  const renderDailyRewards = useMemo(() => {
    if (config.opportunity.library.dailyRewardsTokenAddress) {
      const breakdowns = opportunity.rewardsRecord.breakdowns.filter(breakdown => {
        return breakdown?.token.address === config.opportunity.library.dailyRewardsTokenAddress;
      });
      const token = breakdowns?.[0]?.token;
      const breakdownAmount = breakdowns.reduce((acc, breakdown) => {
        return acc + breakdown.amount;
      }, 0n);
      return (
        <>
          <Title h={3} size={3} look="soft">
            <Value value format={"0,0.##a"}>
              {Fmt.toNumber(breakdownAmount.toString() ?? "0", token?.decimals).toString()}
            </Value>

            {` ${token?.symbol}`}
          </Title>
          <Text className="text-xl">
            <Icon key={token?.icon} src={token?.icon} />
          </Text>
        </>
      );
    }
    return (
      <>
        <Title h={3} size={3} look="soft">
          <Value value format={config.decimalFormat.dollar}>
            {opportunity.dailyRewards ?? 0}
          </Value>
        </Title>
        <Title h={4}>
          <Icons>{rewardIcons}</Icons>
        </Title>
      </>
    );
  }, [opportunity, rewardIcons]);

  return (
    <Box look="soft" size="lg" className="rounded-sm bg-main-0 border-main-6 border-1">
      <Group className="items-center">
        {renderDailyRewards}
        {tags
          .filter(({ type }) => type === "protocol")
          .map(tag => (
            <Tag
              size="sm"
              look="base"
              style={{
                zIndex: 51,
                transition: "z-index 0.2s ease-in-out",
                "&:hover": {
                  zIndex: 0,
                },
              }}
              key={`${tag?.type}_${
                // biome-ignore lint/suspicious/noExplicitAny: templated type
                (tag?.value as any)?.address ?? tag?.value
              }`}
              {...tag}
            />
          ))}
      </Group>
      <Group className="text-xl flex-nowrap">
        <Icons>{icons}</Icons>
        <Text look="bold" bold>
          {opportunity.name}
        </Text>
      </Group>
      {displayLinks && !!visitUrl && (
        <Group>
          {visitUrl && (
            <Button external to={visitUrl} disabled={!visitUrl} look="bold">
              Supply on {opportunity.protocol?.name ? opportunity.protocol.name : "the protocol"}
              <Icon remix="RiArrowRightUpLine" />
            </Button>
          )}
        </Group>
      )}
    </Box>
  );
}
