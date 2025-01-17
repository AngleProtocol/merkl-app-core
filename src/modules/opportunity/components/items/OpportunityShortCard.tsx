import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Icon, Icons, Text } from "dappkit";
import { v4 as uuidv4 } from "uuid";

export type OpportunityShortCardProps = { opportunity: Opportunity; displayLinks?: boolean };

export default function OpportunityShortCard({ opportunity, displayLinks }: OpportunityShortCardProps) {
  const { url, Tags } = useOpportunityData(opportunity);
  const { rewardIcons, formattedDailyRewards } = useOpportunityRewards(opportunity);

  return (
    <Box look="soft" size="lg" className="rounded-sm bg-main-0 border-main-6 border-1">
      <Group className="items-center">
        {formattedDailyRewards}
        <Tags
          size="sm"
          look="base"
          style={{
            zIndex: 51,
            transition: "z-index 0.2s ease-in-out",
            ["&:hover" as string]: {
              zIndex: 0,
            },
          }}
        />
      </Group>
      <Group className="text-xl flex-nowrap">
        <Icons>
          {rewardIcons.map(icon => (
            <Icon {...icon} key={uuidv4()} />
          ))}
        </Icons>
        <Text look="bold" bold>
          {opportunity.name}
        </Text>
      </Group>
      {displayLinks && !!url && (
        <Group>
          {url && (
            <Button external to={url} disabled={!url} look="bold">
              Supply on {opportunity.protocol?.name ? opportunity.protocol.name : "the protocol"}
              <Icon remix="RiArrowRightUpLine" />
            </Button>
          )}
        </Group>
      )}
    </Box>
  );
}
