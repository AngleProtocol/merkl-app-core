import type { Token } from "@merkl/api";
import { Icon, Text } from "dappkit";
import { type ReactNode, useMemo } from "react";

/**
 * Utilities for displaying data & components related to tokens
 * @param tokensData array from api
 */
export default function useTokens(tokensData?: Token[]) {
  /**
   * Filtered Options
   * @description filters on enabled tokens
   */
  const tokens = useMemo(() => tokensData ?? [], [tokensData]);

  /**
   * Selector Options
   * @description filters on enabled tokens
   */
  const options: { [id: number]: ReactNode } = useMemo(
    () =>
      tokens.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: (
              <>
                <Icon size="sm" src={token?.icon} />
                <Text look="bold">{token.name}</Text>
              </>
            ),
          }),
        {},
      ) ?? [],
    [tokens],
  );

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
