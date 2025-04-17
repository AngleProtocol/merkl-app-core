import type { Opportunity } from "@merkl/api";
import type { DistributionType } from "@merkl/api/dist/database/api/.generated";
import { useMemo } from "react";

export default function useOpportunityDistributionTypes(opportunity: Opportunity) {
  const distributionTypes = useMemo(() => {
    return new Set(opportunity?.rewardsRecord?.breakdowns?.filter(x => x.amount > 0n)?.map(x => x?.distributionType));
  }, [opportunity]) as Set<DistributionType>;

  return { distributionTypes };
}
