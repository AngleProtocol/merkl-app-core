import { Box, Button, Group, Icon, Icons, Text, Title, Value } from "dappkit";
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

  return (
    <Box look="soft" size="lg" className="rounded-sm bg-main-0 border-main-6 border-1">
      <Group className="items-center">
        <Value size={3} className="text-main-11" format={config.decimalFormat.dollar}>
          {opportunity.dailyRewards}
        </Value>
        <Title h={4}>
          <Icons>{rewardIcons}</Icons>
        </Title>
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
