import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity } from "@merkl/api";
import { Button, Icon } from "dappkit";
import { blockEvent } from "dappkit";

export type OpportuntiyButtonProps = {
  opportunity: Opportunity;
};

export default function OpportunityButton({ opportunity }: OpportuntiyButtonProps) {
  const { name, Icons, link } = useOpportunityData(opportunity);

  return (
    <Button to={link} onClick={blockEvent(() => {})} look="soft">
      <Icons groupProps={{ className: "flex-nowrap" }} />
      {name}
      <Icon remix="RiArrowRightLine" />
    </Button>
  );
}
