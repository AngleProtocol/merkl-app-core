import type { Token } from "@merkl/api";
import { Group, Hash, Icon, Text } from "dappkit";
import { type ReactNode, useMemo } from "react";
import merklLogo from "../../../assets/images/default-token-logo.svg";

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
              <Group>
                <Icon src={token?.icon === "" ? merklLogo : token?.icon} className="h-[40px] w-[40px]" />
                <Group className="flex-col" size="xs">
                  <Text look="bold" bold size={"md"} className="text-left">
                    {token.name}
                  </Text>
                  <Group>
                    <Text look="tint" size={"sm"}>
                      {token.symbol}
                    </Text>
                    <Hash format={"short"} look="soft" size={"xs"} copy>
                      {token.address}
                    </Hash>
                  </Group>
                </Group>
              </Group>
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
