import type { Reward } from "@merkl/api";
import { type Component, Divider, type GetSet } from "dappkit";
import OpportunityButton from "../../opportunity/OpportunityButton";
import Token from "../../token/Token";
import { ClaimRewardsByOpportunityRow } from "./ClaimRewardsTableByOpportunity";

export type ClaimRewardsTokenTableRowByOpportunityProps = Component<{
  breakdown: Reward["rewards"][number]["breakdowns"][number];
  token: Reward["rewards"][number]["token"];
  checkedState?: GetSet<boolean>;
  showCheckbox?: boolean;
  from: string;
  distributor: string;
}>;

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
