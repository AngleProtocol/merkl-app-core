import { useBalances } from "@core/index.generated";
import type { Token } from "@merkl/api";
import { Group, Hash, Icon, Text } from "dappkit";
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
    (addr: string) => Number(nonNullBalances.find(b => b.address === addr)?.balance || "0"),
    [nonNullBalances],
  );

  /**
   * Selector Options
   * @description filters on enabled tokens
   */
  const options: { [id: number]: ReactNode } = useMemo(() => {
    const sorted = tokens.slice().sort((a, b) => {
      const balA = getTokenBalance(a.address);
      const balB = getTokenBalance(b.address);

      if (balA > 0 && balB === 0) return -1;
      if (balB > 0 && balA === 0) return 1;
      return 0;
    });

    return sorted.reduce<{ [id: string]: ReactNode }>((acc, token) => {
      acc[token.address] = (
        <Group>
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
