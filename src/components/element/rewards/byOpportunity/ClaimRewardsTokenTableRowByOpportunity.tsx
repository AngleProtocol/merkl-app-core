import OpportunityButton from "@core/modules/opportunity/components/OpportunityButton";
import type { Opportunity, Reward } from "@merkl/api";
import { type Component, Divider, type GetSet, type ListProps } from "dappkit";
import Token from "../../../../modules/token/components/element/Token";
import { ClaimRewardsByOpportunityRow } from "./ClaimRewardsTableByOpportunity";

export type ClaimRewardsTokenTableRowByOpportunityProps = Component<{
  breakdown: Reward["rewards"][number]["breakdowns"][number];
  token: Reward["rewards"][number]["token"];
  checkedState?: GetSet<boolean>;
  showCheckbox?: boolean;
  from: string;
  distributor: string;
}> &
  ListProps;

export default function ClaimRewardsTokenTableRowByOpportunity({
  breakdown,
  token,
  checkedState,
  showCheckbox,
  from,
  distributor,
  ...props
}: ClaimRewardsTokenTableRowByOpportunityProps) {
  const unclaimed = BigInt(breakdown.amount) - BigInt(breakdown.claimed);

  return (
    <>
      <Divider look="soft" />
      <ClaimRewardsByOpportunityRow
        {...props}
        key={breakdown.amount}
        positionsColumn={<OpportunityButton opportunity={breakdown.opportunity} />}
        // actionColumn={
        //   !!breakdown.opportunity?.action && <Tag type="action" value={breakdown.opportunity?.action} size="xs" />
        // }
        claimedColumn={
          breakdown.claimed > 0n && <Token token={token} amount={breakdown.claimed} format="symbol" showZero={true} />
        }
        pendingColumn={
          breakdown.pending > 0n && <Token token={token} amount={breakdown.pending} format="symbol" showZero={true} />
        }
        unclaimedColumn={unclaimed > 0n && <Token token={token} amount={unclaimed} format="symbol" />}
      />
    </>
  );
}
