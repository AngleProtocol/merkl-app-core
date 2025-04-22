import type { Opportunity } from "@merkl/api";
import { DistributionType } from "@merkl/api/dist/database/api/.generated";
import { type Component, Icon, type IconProps } from "packages/dappkit/src";
import useOpportunityDistributionTypes from "../../hooks/useOpportunityDistributionTypes";

export type OpportunityAPRIconProps = {
  opportunity: Opportunity;
  floatingAPRIcon?: boolean;
} & IconProps;

export default function OpportunityAPRIcon({
  opportunity,
  floatingAPRIcon,
  ...props
}: Component<OpportunityAPRIconProps>) {
  const { distributionTypes } = useOpportunityDistributionTypes(opportunity);

  if (distributionTypes.size === 0) return null;
  if (distributionTypes.size === 1 && distributionTypes.has(DistributionType.DUTCH_AUCTION))
    return floatingAPRIcon ? <Icon remix="RiRhythmFill" {...props} /> : null;

  if (
    distributionTypes.size === 1 &&
    (distributionTypes.has(DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_AMOUNT) ||
      distributionTypes.has(DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_VALUE) ||
      distributionTypes.has(DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_AMOUNT) ||
      distributionTypes.has(DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_VALUE))
  )
    return <Icon remix="RiLockFill" {...props} />;

  return <Icon remix="RiDashboardFill" {...props} />;
}
