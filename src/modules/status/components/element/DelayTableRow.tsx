import type { Chain } from "@merkl/api";
import { type BoxProps, Duration, Group, Hash, Icon, Text, mergeClass, useWalletContext } from "dappkit";
import { useMemo } from "react";
import type { StatusService } from "../../status.service";
import { DelayRow } from "../library/DelayTable";

export type DelayTableRowProps = {
  delay: Awaited<ReturnType<typeof StatusService.getStatusAndDelays>>[number]["delayed"][number];
  chain: Chain;
} & BoxProps;

export default function DelayTableRow({ delay, chain, className, ...props }: DelayTableRowProps) {
  const { chains } = useWalletContext();
  const computeChain = useMemo(() => chains.find(c => c.id === delay.computeChainId), [chains, delay.computeChainId]);
  return (
    <DelayRow
      size="lg"
      content="sm"
      className={mergeClass("", className)}
      {...props}
      computeChainColumn={
        <Group>
          <Icon src={computeChain?.icon} />
          <Text look="bold" size="sm">
            {computeChain?.name}
          </Text>
        </Group>
      }
      campaignColumn={
        <Hash copy format="prefix">
          {delay.campaignId}
        </Hash>
      }
      opportunityColumn={
        <Text look="bold" size="sm">
          {delay.Opportunity.name}
        </Text>
      }
      delayColumn={<Duration timestamp={delay.delay * 1000} />}
    />
  );
}
