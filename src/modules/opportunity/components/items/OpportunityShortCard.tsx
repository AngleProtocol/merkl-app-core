import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityRewards from "@core/modules/opportunity/hooks/useOpportunityRewards";
import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Icon, Text } from "dappkit";

export type OpportunityShortCardProps = { opportunity: Opportunity; displayLinks?: boolean };

export default function OpportunityShortCard({ opportunity, displayLinks }: OpportunityShortCardProps) {
  const { name, url, Tags, Icons } = useOpportunityData(opportunity);
  const { formattedDailyRewards } = useOpportunityRewards(opportunity);

  return (
    <Box look="soft" size="lg" className="rounded-sm bg-accent-0 border-accent-6 border-1">
      <Group className="items-center">
        {formattedDailyRewards}
        <Tags
          only={["protocol"]}
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
        <Icons />
        <Text look="bold" bold>
          {name}
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
