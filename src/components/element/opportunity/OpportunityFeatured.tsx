import config from "merkl.config";
import { useMemo } from "react";
import type { Opportunity } from "../../../modules/opportunity/opportunity.model";
import OpportunityCell from "./OpportunityCell";

type OpportunityFeaturedProps = {
  opportunities: Opportunity[];
  maxLength?: number;
  title?: string;
};

export default function OpportunityFeatured({
  opportunities,
  maxLength = config.opportunity.featured.length,
}: OpportunityFeaturedProps) {
  const renderOpportunities = useMemo(() => {
    return opportunities
      .slice(0, maxLength)
      .map(o => (
        <OpportunityCell
          hideTags={["action", "chain", "status", "token", "tokenChain"]}
          key={`${o.chainId}_${o.type}_${o.identifier}`}
          opportunity={o}
        />
      ));
  }, [opportunities, maxLength]);

  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">{renderOpportunities}</div>;
}
