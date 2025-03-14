import { useMerklConfig } from "@core/modules/config/config.context";
import Token from "@core/modules/token/components/element/Token";
import { TokenService } from "@core/modules/token/token.service";
import type { Token as TokenType } from "@merkl/api";
import { Group, Icon, Select, type SelectProps, Text, Title, Value } from "dappkit";
import { Fmt } from "dappkit";
import { useMemo } from "react";

export type TokenSelectProps = {
  tokens: (TokenType & { balance: bigint })[];
  balances?: boolean;
} & SelectProps<string>;

export default function TokenSelect({ tokens, balances, ...props }: TokenSelectProps) {
  const backend = useMerklConfig(store => store.config.backend);
  const sortedTokens = useMemo(() => TokenService({ backend }).sortForUser(tokens), [tokens, backend]);
  const decimalFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const options = useMemo(
    () =>
      sortedTokens?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: <Token key={token.address} value token={token} />,
          }),
        {},
      ) ?? {},
    [sortedTokens],
  );

  const searchOptions = useMemo(
    () =>
      sortedTokens?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: `${token.symbol}-${token.name}-${token.address}`,
          }),
        {},
      ) ?? {},
    [sortedTokens],
  );

  const displayOptions = useMemo(
    () =>
      sortedTokens
        ?.sort((a, b) => {
          if (a.price && b.price) return Fmt.toPrice(a.balance, a) - Fmt.toPrice(b.balance, b);
          if (a.price) return -1;
          if (b.price) return 1;

          return Number(a.balance - b.balance);
        })
        ?.reduce(
          (obj, token) =>
            Object.assign(obj, {
              [token.address]: (
                <Group size="xl" className="w-full justify-between items-center gap-xl*2">
                  <Group className="flex-grow items-center">
                    <Title h={3}>
                      <Icon size="lg" src={token.icon} />
                    </Title>
                    <Group className="flex-col !gap-0">
                      <Text look="bold" bold>
                        {token.name}
                      </Text>
                      <Text look="soft" className="flex">
                        <Text look="soft" className="flex gap-sm">
                          <Value format="0,0.###a">{Fmt.toNumber(token.balance, token.decimals)}</Value> {token.symbol}
                        </Text>
                        <span className="mr-sm" />(
                        <Value format={decimalFormat}>{Fmt.toPrice(token.balance, token)}</Value>)
                      </Text>
                    </Group>
                  </Group>
                </Group>
              ),
            }),
          {},
        ) ?? {},
    [sortedTokens, decimalFormat],
  );

  return (
    <Select
      search
      placeholder="Select token"
      options={options}
      searchOptions={searchOptions}
      displayOptions={displayOptions}
      {...props}
    />
  );
}
