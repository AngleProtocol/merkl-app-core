import { useMerklConfig } from "@core/modules/config/config.context";
import useOpportunityMetadata from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import { Button, Icon } from "dappkit";
import { blockEvent } from "dappkit";

export type OpportuntiyButtonProps = {
  opportunity: Parameters<typeof useOpportunityMetadata>["0"];
};

export default function OpportunityButton({ opportunity }: OpportuntiyButtonProps) {
  const { name, Icons, link } = useOpportunityMetadata(opportunity);
  const tags = useMerklConfig(store => store.config.tags);

  return (
    <Button
      disabled={tags && !opportunity.tags.some(t => tags?.includes(t))}
      to={link}
      onClick={blockEvent(() => {})}
      look="soft">
      <Icons groupProps={{ className: "flex-nowrap" }} />
      {name}
      <Icon remix="RiArrowRightLine" />
    </Button>
  );
}
