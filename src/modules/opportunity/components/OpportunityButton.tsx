import merklConfig from "@core/config";
import useOpportunityMetadata from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import { Button, Icon } from "dappkit";
import { blockEvent } from "dappkit";

export type OpportuntiyButtonProps = {
  opportunity: Parameters<typeof useOpportunityMetadata>["0"];
};

export default function OpportunityButton({ opportunity }: OpportuntiyButtonProps) {
  const { name, Icons, link } = useOpportunityMetadata(opportunity);

  return (
    <Button
      disabled={merklConfig.tags && !opportunity.tags.some(t => merklConfig?.tags?.includes(t))}
      to={link}
      onClick={blockEvent(() => {})}
      look="soft">
      <Icons groupProps={{ className: "flex-nowrap" }} />
      {name}
      <Icon remix="RiArrowRightLine" />
    </Button>
  );
}
