import { useMerklConfig } from "@core/modules/config/config.context";
import useTokens from "@core/modules/token/hooks/useTokens";
import type { Opportunity } from "@merkl/api";
import { Divider, Group, Icon, Text, Value } from "dappkit";

type TvlRowAllocationProps = {
  opportunity: Opportunity;
};

export default function TvlRowAllocation({ opportunity }: TvlRowAllocationProps) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const { navigateToCoinGecko: navigateToCoinGeckoToken0 } = useTokens(opportunity.tokens[0]);
  const { navigateToCoinGecko: navigateToCoinGeckoToken1 } = useTokens(opportunity.tokens[1]);

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
                <Icon remix="RiExternalLinkLine" className="cursor-pointer" onClick={navigateToCoinGeckoToken0} />
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
                <Icon remix="RiExternalLinkLine" className="cursor-pointer" onClick={navigateToCoinGeckoToken1} />
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
