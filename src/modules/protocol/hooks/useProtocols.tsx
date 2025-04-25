import type { Protocol } from "@merkl/api";
import { Icon, Text } from "dappkit";
import { type ReactNode, useMemo } from "react";

/**
 * Utilities for displaying data & components related to protocols
 * @param protocols array from api
 */
export default function useProtocols(protocols?: Protocol[]) {
  /**
   * Selector Options
   */
  const options: { [id: number]: ReactNode } = useMemo(
    () =>
      protocols?.reduce(
        (obj, protocol) =>
          Object.assign(obj, {
            [protocol.name]: (
              <>
                <Icon size="sm" src={protocol?.icon} />
                <Text look="bold">{protocol.name}</Text>
              </>
            ),
          }),
        {},
      ) ?? [],
    [protocols],
  );

  const isSingleProtocol = protocols?.length === 1;

  return {
    options,
    isSingleProtocol,
  };
}
