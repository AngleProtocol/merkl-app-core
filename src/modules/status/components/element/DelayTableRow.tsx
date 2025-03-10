import type { Api } from "@core/api/types";
import type { Chain } from "@merkl/api";
import {
  type BoxProps,
  Button,
  Duration,
  Group,
  Hash,
  Icon,
  Text,
  Tooltip,
  mergeClass,
  useWalletContext,
} from "dappkit";
import { useMemo } from "react";
import { DelayRow } from "../library/DelayTable";

export type DelayTableRowProps = {
  delay: NonNullable<
    Awaited<ReturnType<Api["v4"]["campaign-status"]["delay"]["status"]["get"]>>["data"]
  >[number]["delayed"][0];
  chain: Chain;
} & BoxProps;

export default function DelayTableRow({ delay, chain, className, ...props }: DelayTableRowProps) {
  const { chains } = useWalletContext();

  const computeChain = useMemo(() => chains.find(c => c.id === delay.computeChainId), [chains, delay.computeChainId]);

  /**
   * Internal link to the opportunity on this app
   */
  const link = useMemo(
    () =>
      `/opportunities/${computeChain?.name?.toLowerCase?.().replace(" ", "-")}/${delay.Opportunity.type}/${delay.Opportunity.id}`,
    [delay, computeChain],
  );

  return (
    <DelayRow
      size="lg"
      content="sm"
      className={mergeClass("", className)}
      {...props}
      computeChainColumn={
        <Group className="items-center">
          <Icon src={computeChain?.icon} />
          <Text look="bold" size="sm">
            {computeChain?.name}
          </Text>
        </Group>
      }
      campaignColumn={
        <Group className="items-center">
          <Hash copy format="prefix">
            {delay.campaignId}
          </Hash>{" "}
          <Tooltip icon={false} helper={<>This is a test campaign.</>}>
            {delay.RewardToken.isTest && <Icon remix="RiTestTubeFill" />}
          </Tooltip>
        </Group>
      }
      opportunityColumn={
        <Button look="soft" size="sm" to={link}>
          {delay.Opportunity.name}
        </Button>
      }
      delayColumn={<Duration timestamp={delay.delay * 1000} />}
      reasonColumn={<Text size="sm">{delay.CampaignStatus?.[0]?.error}</Text>}
    />
  );
}
