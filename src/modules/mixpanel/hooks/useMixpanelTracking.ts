import { useMerklConfig } from "@core/modules/config/config.context";
import { useCallback } from "react";
import { type MixpanelEvents, MixpanelService } from "../mixpanel.service";

export default function useMixpanelTracking() {
  const mixpanelConfiguration = useMerklConfig(store => store.config.mixpanel);

  const track = useCallback(
    <const Event extends keyof MixpanelEvents>(event: Event, data: MixpanelEvents[Event]) => {
      if (!mixpanelConfiguration || !mixpanelConfiguration.token) return;

      const events: { [E in keyof MixpanelEvents]: (_data: MixpanelEvents[E]) => void } = {
        "Click on Opportunity": ({ chainId, status, protocol, tokens, view }) =>
          MixpanelService({}).track(event, { chainId, status, protocol, tokens, view }),
        "Check filters": params => MixpanelService({}).track(event, params),
      };

      return events[event]?.(data);
    },
    [mixpanelConfiguration],
  );

  return {
    enabled: !!mixpanelConfiguration,
    track,
  };
}
