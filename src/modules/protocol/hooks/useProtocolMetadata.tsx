import type { Protocol } from "@merkl/api";
import { PrimitiveTag } from "packages/dappkit/src";
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

  /**
   * TagProps for each metadata that can be represented as a tag
   */
  const tags = useMemo(() => {
    return protocol.tags.map(tag => {
      if (tag.toUpperCase() !== tag || tag === tag.toLowerCase()) return;
      return (
        <PrimitiveTag look="soft" key={tag}>
          {tag}
        </PrimitiveTag>
      );
    });
  }, [protocol.tags]);

  return { name, icon, description, link, tags };
}
