import config from "merkl.config";
import merklConfig from "merkl.config";
import { Group, Icon, Select, type SelectProps, Text, Title, Value } from "packages/dappkit/src";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useMemo } from "react";
import Token from "./Token";

export type TokenSelectProps = {
  tokens: (Token & { balance: bigint })[];
  balances?: boolean;
} & SelectProps<string>;

export default function TokenSelect({ tokens, balances, ...props }: TokenSelectProps) {
  const sortedTokens = useMemo(() => {
    if (!tokens) return [];
    const tokensWithBalance = tokens
      .filter(({ balance }) => balance > 0)
      .sort((a, b) => {
        if (a.price && b.price) return Fmt.toPrice(b.balance, b) - Fmt.toPrice(a.balance, a);
        if (a.price && a.balance && Fmt.toPrice(a.balance, a)) return -1;
        if (b.price && b.balance && Fmt.toPrice(b.balance, b)) return 1;

        return b.balance - a.balance;
      });
    const tokensWithNoBalance = tokens.filter(({ balance }) => balance === "0" || !balance || balance <= 0n);

    const tokensInPriority = !merklConfig?.tokenSymbolPriority?.length
      ? tokensWithNoBalance
      : merklConfig?.tokenSymbolPriority
          .map(s => tokensWithNoBalance.find(({ symbol }) => symbol === s))
          .filter(t => t !== undefined);

    const otherTokens = tokensWithNoBalance.filter(s => merklConfig?.tokenSymbolPriority?.includes(s));

    return [...tokensWithBalance, ...tokensInPriority, ...otherTokens];
  }, [tokens]);

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

          return a.balance - b.balance;
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
                      <Text look="soft" className="flex gap-sm">
                        {token.symbol} -{" "}
                        <Value format={config.decimalFormat.dollar}>{Fmt.toPrice(token.balance, token)}</Value> -{" "}
                        <Value format="0,0.###a">{Fmt.toNumber(token.balance, token.decimals)}</Value>{" "}
                      </Text>
                    </Group>
                  </Group>
                </Group>
              ),
            }),
          {},
        ) ?? {},
    [sortedTokens],
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
