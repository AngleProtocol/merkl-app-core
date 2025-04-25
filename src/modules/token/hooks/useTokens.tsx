import { useBalances } from "@core/index.generated";
import type { Token } from "@merkl/api";
import { Fmt, Group, Hash, Icon, Text, Value } from "dappkit";
import { type ReactNode, useCallback, useMemo } from "react";
import merklLogo from "../../../assets/images/default-token-logo.svg";

/**
 * Utilities for displaying data & components related to tokens
 * @param tokensData array from api
 */
export default function useTokens(tokensData?: Token[], chainId?: number) {
  /**
   * Filtered Options
   * @description filters on enabled tokens
   */
  const tokens = useMemo(() => tokensData ?? [], [tokensData]);

  const { balances } = useBalances(chainId);

  const nonNullBalances = useMemo(() => {
    if (!balances) return [];
    return balances.filter(b => b.balance !== null && b.balance !== undefined && Number(b.balance) > 0);
  }, [balances]);

  const getTokenBalance = useCallback(
    (addr: string) => nonNullBalances.find(b => b.address === addr)?.balance || 0n,
    [nonNullBalances],
  );

  /**
   * Selector Options
   * @description filters on enabled tokens
   */
  const options: { [id: number]: ReactNode } = useMemo(() => {
    const sorted = tokens.slice().sort((a, b) => {
      const balA = Fmt.toNumber(getTokenBalance(a.address), a.decimals);
      const balB = Fmt.toNumber(getTokenBalance(b.address), b.decimals);

      const isZeroA = balA === 0;
      const isZeroB = balB === 0;

      if (isZeroA && !isZeroB) return 1;
      if (!isZeroA && isZeroB) return -1;

      if (balA > balB) return -1;
      if (balA < balB) return 1;

      return 0;
    });

    return sorted.reduce<{ [id: string]: ReactNode }>((acc, token) => {
      const balance = getTokenBalance(token.address);
      acc[token.address] = (
        <Group key={token.address}>
          <Icon src={token.icon || merklLogo} className="h-[40px] w-[40px]" />
          <Group className="flex-col" size="xs">
            <Text look="bold" bold size="md" className="text-left">
              {token.name}
            </Text>
            <Group>
              <Text look="tint" size="sm">
                {token.symbol}
              </Text>
              <Hash format="short" look="soft" size="xs" copy>
                {token.address}
              </Hash>
              {balance !== 0n && (
                <Value format="0,0.000##a" size={"xs"} look="soft">
                  {Fmt.toNumber(balance.toString(), token.decimals)}
                </Value>
              )}
            </Group>
          </Group>
        </Group>
      );
      return acc;
    }, {});
  }, [tokens, getTokenBalance]);

  /**
   * Selector Options
   * @description filters on enabled tokens
   */
  const searchOptions: { [id: number]: ReactNode } = useMemo(
    () =>
      tokens.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: token.name,
          }),
        {},
      ) ?? [],
    [tokens],
  );

  const indexOptions: { [id: number]: number } = useMemo(
    () =>
      tokens.reduce(
        (obj, token, index) =>
          Object.assign(obj, {
            [token.address]: index,
          }),
        {},
      ) ?? [],
    [tokens],
  );

  return {
    tokens,
    options,
    searchOptions,
    indexOptions,
  };
}
