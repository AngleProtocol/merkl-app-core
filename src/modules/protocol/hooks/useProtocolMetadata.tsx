import Tag from "@core/components/element/Tag";
import type { Protocol } from "@merkl/api";
import type { OpportunityAction } from "@merkl/api/dist/database/api/.generated";
import { useMemo } from "react";

/**
 * Formats basic metadata for a given protocol
 */
export default function useProtocolMetadata({ icon, ...protocol }: Protocol) {
  /**
   * Formatted description of the protocol
   */
  const name = useMemo(() => protocol.name?.charAt(0).toUpperCase() + protocol.name?.slice(1), [protocol.name]);

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
    return protocol.opportunityLiveTags?.map(tag => {
      return <Tag type="action" value={tag as OpportunityAction} key={tag} />;
    });
  }, [protocol.opportunityLiveTags]);

  return { name, icon, description, link, tags };
}
