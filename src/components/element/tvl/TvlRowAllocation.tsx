import type { Opportunity } from "@merkl/api";
import { Divider, Group, Icon, Text, Value } from "dappkit";
import merklConfig from "../../../config";

type TvlRowAllocationProps = {
  opportunity: Opportunity;
};

export default function TvlRowAllocation({ opportunity }: TvlRowAllocationProps) {
  let content: React.ReactNode = null;
  switch (opportunity.type) {
    case "CLAMM": {
      const tokenTvl = opportunity.tvlRecord?.breakdowns.filter(b => b.type === "TOKEN");
      const token0 = opportunity.tokens[0];
      const token1 = opportunity.tokens[1];
      const tvlBreakdownToken0 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[0]?.address);
      const tvlBreakdownToken1 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[1]?.address);

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
              <Text size="sm">
                (
                <Value value format={merklConfig.decimalFormat.dollar}>
                  {tvlBreakdownToken0.value * token0.price}
                </Value>
                {" - "}
                <Value value format="0a%">
                  {(tvlBreakdownToken0?.value * token0.price) / opportunity.tvlRecord.total}
                </Value>
                {"TVL"})
              </Text>
            )}
          </Text>
          <Text className="flex items-center gap-sm" size="sm" look="soft">
            <Icon src={opportunity.tokens[1].icon} />
            <Text bold className="flex gap-sm">
              <Value value format="0.0a">
                {tvlBreakdownToken1?.value}
              </Value>
              <span>{token1.symbol}</span>
            </Text>

            {!!tvlBreakdownToken1?.value && !!token1?.price && (
              <Text size="sm">
                (
                <Value value format={merklConfig.decimalFormat.dollar}>
                  {tvlBreakdownToken1.value * token1.price}
                </Value>
                {" - "}
                <Value value format="0a%">
                  {(tvlBreakdownToken1?.value * token1.price) / opportunity.tvlRecord.total}
                </Value>
                {"TVL"})
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
    <Group className="flex-col">
      <Text bold className="flex items-center gap-xs " size="sm" look="bold">
        <Icon remix="RiWaterFlashFill" />
        TVL Allocation
      </Text>
      <Divider />
      {content}
    </Group>
  );
}
