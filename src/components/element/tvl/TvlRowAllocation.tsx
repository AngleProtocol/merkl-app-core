import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Divider, Group, Icon, Text, Value } from "dappkit";
import { useCallback } from "react";

type TvlRowAllocationProps = {
  opportunity: Opportunity;
};

export default function TvlRowAllocation({ opportunity }: TvlRowAllocationProps) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  let content: React.ReactNode = null;
  switch (opportunity.type) {
    case "CLAMM": {
      const tokenTvl = opportunity.tvlRecord?.breakdowns.filter(b => b.type === "TOKEN");
      const token0 = opportunity.tokens[0];
      const token1 = opportunity.tokens[1];
      const tvlBreakdownToken0 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[0]?.address);
      const tvlBreakdownToken1 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[1]?.address);

      const navigateToExplorer = useCallback(
        (address: string) => {
          const explorer = opportunity.chain?.Explorer?.[0].url;
          window.open(`${explorer}/token/${address}`, "_blank");
        },
        [opportunity.chain?.Explorer?.[0].url],
      );

      content = (
        <Group className="flex-col" size="sm">
          <Text className="flex items-center gap-sm" size="sm" look="soft">
            <Icon src={opportunity.tokens[0].icon} />
            <Text bold className="flex gap-sm">
              <Value value format="0.0a">
                {tvlBreakdownToken0?.value}
              </Value>
              <span>{token0.symbol}</span>
            </Text>

            {!!tvlBreakdownToken0?.value && !!token0?.price && (
              <Text size="sm" className="flex items-center gap-sm">
                (
                <Value value format={dollarFormat}>
                  {tvlBreakdownToken0.value * token0.price}
                </Value>
                {" - "}
                <Value value format="0a%">
                  {(tvlBreakdownToken0?.value * token0.price) / opportunity.tvlRecord.total}
                </Value>
                {" TVL"})
                <Button external size="xs" look="soft" onClick={() => navigateToExplorer(token0.address)}>
                  <Icon remix="RiExternalLinkLine" />
                </Button>
              </Text>
            )}
          </Text>
          <Text className="flex items-center gap-sm" size="sm" look="soft">
            <Icon src={opportunity.tokens[1].icon} />
            <Text bold className="flex gap-sm" size="sm">
              <Value value format="0.0a">
                {tvlBreakdownToken1?.value}
              </Value>
              <span>{token1.symbol}</span>
            </Text>

            {!!tvlBreakdownToken1?.value && !!token1?.price && (
              <Text size="sm" className="flex items-center gap-sm">
                (
                <Value value format={dollarFormat}>
                  {tvlBreakdownToken1.value * token1.price}
                </Value>
                {" - "}
                <Value value format="0a%">
                  {(tvlBreakdownToken1?.value * token1.price) / opportunity.tvlRecord.total}
                </Value>
                {" TVL"})
                <Button external size="xs" look="soft" onClick={() => navigateToExplorer(token1.address)}>
                  <Icon remix="RiExternalLinkLine" />
                </Button>
              </Text>
            )}
          </Text>
        </Group>
      );
      break;
    }
    default:
      content = null;
  }
  if (!content) return null;
  return (
    <Group className="flex-col" size="sm">
      <Text bold className="flex items-center gap-xs " size="sm" look="bold">
        <Icon remix="RiWaterFlashFill" />
        TVL Allocation
      </Text>
      <Divider />
      {content}
    </Group>
  );
}
