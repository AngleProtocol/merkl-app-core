import type { Opportunity } from "@merkl/api";
import { Button, Icon, Icons } from "dappkit";
import { blockEvent } from "dappkit";
import useOpportunity from "../../../hooks/resources/useOpportunity";

export type OpportuntiyButtonProps = {
  opportunity: Opportunity;
};

export default function OpportunityButton({ opportunity }: OpportuntiyButtonProps) {
  const { icons, link } = useOpportunity(opportunity);

  return (
    <Button to={link} onClick={blockEvent(() => {})} look="soft">
      <Icons size="sm">{icons}</Icons>
      {opportunity.name}
      <Icon remix="RiArrowRightLine" />
    </Button>
  );
}
