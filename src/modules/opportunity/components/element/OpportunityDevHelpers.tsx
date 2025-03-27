import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import { Button, type Component, EventBlocker, Group, Icon, useClipboard } from "dappkit";
import { useState } from "react";
import { OpportunityService } from "../../opportunity.service";

export type OpportunityDevHelpersProps = {
  opportunityId: string;
};

export default function OpportunityDevHelpers({ opportunityId }: Component<OpportunityDevHelpersProps>) {
  const opportunityService = OpportunityService({ api });

  // Dev helpers
  const showDevelopmentHelpers = useMerklConfig(store => store.config.backend.showDevelopmentHelpers);
  const [isReparsing, setIsReparsing] = useState(false);

  const { copy: copyCall, isCopied } = useClipboard();

  return (
    !!showDevelopmentHelpers && (
      <EventBlocker>
        <Group>
          <Button className="inline-flex" look="hype" size="md" onClick={async () => copyCall(opportunityId)}>
            <Icon remix={isCopied ? "RiCheckboxCircleFill" : "RiFileCopyFill"} size="sm" />
          </Button>
          <Button
            className="inline-flex"
            look="hype"
            size="md"
            onClick={async () => {
              setIsReparsing(true);
              try {
                await (await opportunityService).reparse(opportunityId);
              } catch {}
              setIsReparsing(false);
            }}>
            {isReparsing ? (
              <Icon remix="RiLoader2Fill" className="text-main-12 animate-spin" />
            ) : (
              <Icon remix="RiRestartLine" size="sm" />
            )}
          </Button>
        </Group>
      </EventBlocker>
    )
  );
}
