import { useMerklConfig } from "@core/modules/config/config.context";
import { useWalletContext } from "packages/dappkit/src";
import { useCallback } from "react";
import { type MixpanelEvents, MixpanelService } from "../mixpanel.service";

export default function useMixpanelTracking() {
  const mixpanelConfiguration = useMerklConfig(store => store.config.mixpanel);
  const { chains } = useWalletContext();

  const track = useCallback(
    <const Event extends keyof MixpanelEvents>(event: Event, data: MixpanelEvents[Event]) => {
      if (!mixpanelConfiguration || !mixpanelConfiguration.token) return;

      const events: { [E in keyof MixpanelEvents]: (_data: MixpanelEvents[E]) => void } = {
        "Click on Opportunity": ({ chainId, status, protocol, tokens, view }) => {
          const chain = chains?.find(c => c.id === chainId)?.name?.toLowerCase();
          const tkns = tokens?.reduce(
            (obj, { symbol }, index) => {
              obj[`token${index}`] = symbol;
              return obj;
            },
            {} as { [key: string]: string },
          );

          MixpanelService({}).track(event, { chainId, status, protocol: protocol?.id, ...tkns, view, chain });
        },
        "Check filters": params => MixpanelService({}).track(event, params),
      };

      return events[event]?.(data);
    },
    [mixpanelConfiguration, chains],
  );

  return {
    enabled: !!mixpanelConfiguration,
    track,
  };
}
