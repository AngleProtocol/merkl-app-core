import type { Campaign } from "@merkl/api";
import { Button, Dropdown } from "dappkit";

type RestrictionsCollumnProps = {
  campaign: Campaign;
};

export default function RestrictionsCollumn(props: RestrictionsCollumnProps) {
  const { campaign } = props;

  const hasWhitelist = campaign.params.whitelist.length > 0;
  const hasBlacklist = campaign.params.blacklist.length > 0;

  return (
    <Dropdown content={null}>
      {hasWhitelist && (
        <Button look="soft" size="xs">
          Whitelist
        </Button>
      )}

      {hasBlacklist && (
        <Button look="soft" size="xs">
          Blacklist
        </Button>
      )}
    </Dropdown>
  );
}
