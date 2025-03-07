import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { useMemo } from "react";
import OpportunityCell from "../items/OpportunityCell";

type OpportunityFeaturedProps = {
  opportunities: Opportunity[];
  maxLength?: number;
  title?: string;
};

export default function OpportunityFeatured({ opportunities, maxLength }: OpportunityFeaturedProps) {
  const configLength = useMerklConfig(store => store.config.opportunity.featured.length);
  const renderOpportunities = useMemo(() => {
    return opportunities
      .slice(0, maxLength ?? configLength)
      .map(o => <OpportunityCell tags={[]} key={`${o.chainId}_${o.type}_${o.identifier}`} opportunity={o} />);
  }, [opportunities, maxLength, configLength]);

  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">{renderOpportunities}</div>;
}
