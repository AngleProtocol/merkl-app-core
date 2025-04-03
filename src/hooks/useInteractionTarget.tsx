import { api } from "@core/api";
//TODO: export from api index
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useEffect, useState } from "react";
import { InteractionService } from "../modules/interaction/interaction.service";

export default function useInteractionTargets(
  chainId?: number,
  protocolId?: string,
  identifier?: string,
  serverTargets?: InteractionTarget[],
) {
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState<InteractionTarget[] | undefined>();

  useEffect(() => {
    async function fetchTarget() {
      if (!chainId || !protocolId || !identifier) return;

      setLoading(true);

      try {
        const _targets = await InteractionService({ api }).getTargets(chainId, protocolId, identifier);

        if (_targets?.length) setTargets(_targets);
      } catch {}
      setLoading(false);
    }

    !serverTargets && fetchTarget();
  }, [chainId, protocolId, identifier, serverTargets]);

  return { targets: serverTargets || targets, loading };
}
