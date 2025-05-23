import { useChain } from "@core/index.generated";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, Divider, Group, Icon, Text, Value } from "dappkit";
import { useCallback } from "react";

type TvlRowAllocationProps = {
  opportunity: Opportunity;
};

export default function TvlRowAllocation({ opportunity }: TvlRowAllocationProps) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const { chain } = useChain({ id: opportunity.chain?.id });

  const tokenTvl = opportunity.tvlRecord?.breakdowns.filter(b => b.type === "TOKEN");
  let content: React.ReactNode = null;

  if (tokenTvl.length >= 2) {
    const navigateToExplorer = useCallback(
      (address: string) => {
        const explorer = chain?.explorers?.[0].url;
        window.open(`${explorer}/token/${address}`, "_blank", "noopener,noreferrer");
      },
      [chain],
    );

    content = (
      <Group className="flex-col" size="sm">
        {tokenTvl.map(tvlBreakdown => {
          let token = opportunity.tokens.find(t => t.id === tvlBreakdown.identifier);
          if (!token) token = opportunity.tokens.find(t => t.address === tvlBreakdown.identifier);

          if (!token) return null;
          return (
            <Text key={tvlBreakdown.identifier} className="flex items-center gap-sm" size="sm" look="soft">
              <Icon src={token.icon} />
              <Text bold className="flex gap-sm" size="sm">
                <Value value format="0.0a">
                  {tvlBreakdown?.value}
                </Value>
                <span>{token.symbol}</span>
              </Text>

              {!!tvlBreakdown?.value && !!token?.price && (
                <Text size="sm" className="flex items-center gap-sm">
                  (
                  <Value value format={dollarFormat}>
                    {tvlBreakdown.value * token.price}
                  </Value>
                  {" - "}
                  <Value value format="0a%">
                    {(tvlBreakdown?.value * token.price) / opportunity.tvlRecord.total}
                  </Value>
                  {" TVL"})
                  <Button external size="xs" look="soft" onClick={() => navigateToExplorer(token.address)}>
                    <Icon remix="RiExternalLinkLine" />
                  </Button>
                </Text>
              )}
            </Text>
          );
        })}
      </Group>
    );
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
