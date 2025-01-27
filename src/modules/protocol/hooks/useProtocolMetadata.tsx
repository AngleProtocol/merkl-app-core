import type { Protocol } from "@merkl/api";
import { useMemo } from "react";

/**
 * Formats basic metadata for a given protocol
 */
export default function useProtocolMetadata({ name, icon, ...protocol }: Protocol) {
  /**
   * Formatted description of the protocol
   */
  const description = useMemo(() => {
    if (protocol.description && protocol.description !== "") return protocol.description;
    return `Earn rewards by supplying liquidity on ${name}`;
  }, [protocol.description, name]);

  /**
   * Internal link to the protocol on this app
   */
  const link = useMemo(() => `/protocols/${protocol?.id}`, [protocol.id]);

  return { name, icon, description, link };
}
