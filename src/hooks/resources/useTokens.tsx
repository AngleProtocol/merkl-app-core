import type { Token } from "@merkl/api";
import { Icon } from "dappkit";
import { type ReactNode, useMemo } from "react";

/**
 * Utilities for displaying data & components related to chains
 * @param tokenData array from api
 */
export default function useTokens(tokenData?: Token[]) {
  /**
   * Selector Options
   * @description filters on enabled chains from the config & api
   */
  const options: { [id: number]: ReactNode } = useMemo(() => {
    if (!tokenData) return {};
    return (
      tokenData.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.id]: (
              <>
                <Icon size="sm" src={token?.icon} />
                {token.name}
              </>
            ),
          }),
        {},
      ) ?? []
    );
  }, [tokenData]);

  return {
    options,
  };
}
