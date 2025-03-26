import Chain from "@core/modules/chain/components/element/Chain";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { Chain as ChainType } from "@merkl/api";
import { Box, Divider, Dropdown, Group, Hash, Icon, PrimitiveTag, Text, Value, useWalletContext } from "dappkit";
import { type ReactNode, useMemo } from "react";

export type JumperBridgeRuleProps = {
  value: {
    label: ReactNode;
    fromchains: number[];
    hooktype: number;
    tokens: string[];
    since: number;
    minAmountInUSD: number;
  };
};

export default function JumperBridgeRule({
  value: { label, fromchains, tokens, since, minAmountInUSD },
  ...props
}: JumperBridgeRuleProps) {
  const { chains } = useWalletContext();
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const rawChainsEntities = useMemo(
    () => fromchains.map(chainId => chains.find(c => c.id === chainId)),
    [fromchains, chains],
  );

  const formatedDate = useMemo(
    () =>
      new Date(since * 1000).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [since],
  );

  const renderChainByGroup = useMemo(() => {
    return rawChainsEntities
      .reduce<ChainType[][]>((acc, chain, index) => {
        if (index % 7 === 0) acc.push([]); // MODULO 7
        acc[acc.length - 1].push(chain);
        return acc;
      }, [])
      .map((group, idx) => (
        <Group key={idx.toString().concat("")} className="flex-col" size="xs">
          {group.map(chain => chain && <Chain key={chain?.id} chain={chain} size="xs" />)}
        </Group>
      ));
  }, [rawChainsEntities]);

  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={
        <Group className="flex-col">
          <Group size={"sm"}>
            <Icon remix="RiInformationFill" className="text-main-11" />
            <Text bold look="tint">
              Restriction to Jumper Bridgers
            </Text>
          </Group>
          <Group size={"xl"} className="flex-col">
            <Divider />
            <Text>
              Bridge above{" "}
              <PrimitiveTag look="soft" size={"sm"} className="inline">
                <Value format={dollarFormat} size={"sm"}>
                  {minAmountInUSD}
                </Value>
              </PrimitiveTag>{" "}
              on <Text look="hype">Jumper bridge</Text>
            </Text>
            <Text>
              Since{" "}
              <PrimitiveTag look="base" size={"sm"} className="inline">
                {formatedDate}
              </PrimitiveTag>
            </Text>
            <Divider />
          </Group>
          <Group>
            <Box>
              <Text look="bold" size={"sm"}>
                Bridge from these chain:
              </Text>
              <Divider />
              <Group className="flex-row">
                {rawChainsEntities && rawChainsEntities.length > 0 && renderChainByGroup}
              </Group>
            </Box>
            <Box>
              <Text look="bold" size={"sm"}>
                With one of this token:
              </Text>
              <Divider />
              <Group className="flex-col">
                {tokens.map(tokenAddresses => (
                  <Hash key={tokenAddresses} format="short" copy size={"xs"}>
                    {tokenAddresses}
                  </Hash>
                ))}
              </Group>
            </Box>
          </Group>
        </Group>
      }>
      <PrimitiveTag look="soft" {...props}>
        <Icon remix="RiLinksLine" />
        {label}
      </PrimitiveTag>
    </Dropdown>
  );
}
