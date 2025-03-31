import { useMerklConfig } from "@core/modules/config/config.context";
import { useWalletContext } from "packages/dappkit/src";
import { useCallback } from "react";
import { type MixpanelEvents, MixpanelService } from "../mixpanel.service";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { useLocation } from "@remix-run/react";

export default function useMixpanelTracking() {
  const mixpanelConfiguration = useMerklConfig(store => store.config.mixpanel);
  const { chains } = useWalletContext();
  const location = useLocation();
  const metadata = useMetadata(location.pathname);
  const routes = useMerklConfig(store => store.config.routes);

  metadata?.findAbstractRoute(routes);

  const track = useCallback(
    <const Event extends keyof MixpanelEvents>(event: Event, data: MixpanelEvents[Event]) => {
      if (!mixpanelConfiguration || !mixpanelConfiguration.token) return;

      const events: { [E in keyof MixpanelEvents]: (_data: MixpanelEvents[E]) => void } = {
        "Click on opportunity": ({ view, page, ...opportunity }) => {
          MixpanelService({}).trackOpportunityButton(
            "Opportunity",
            "none",
            {
              view,
              page,
            },
            opportunity,
            chains,
          );
        },
        "Click on button": ({ button, type, page }) => {
          MixpanelService({}).trackButton(button, type, { page });
        },
        "Click on supply": ({ page, mode, ...opportunity }) => {
          MixpanelService({}).trackOpportunityButton("supply", mode, { page }, opportunity, chains);
        },
        "Click on leadeboard": ({ chainId, status, protocol, tokens, view, page, action }) => {
          const chain = chains?.find(c => c.id === chainId)?.name?.toLowerCase();
          const tkns = tokens?.reduce(
            (obj, { symbol }, index) => {
              obj[`token${index}`] = symbol;
              return obj;
            },
            {} as { [key: string]: string },
          );

          MixpanelService({}).trackButton("Leaderboard", "none", {
            status,
            action,
            protocol: protocol?.id,
            ...tkns,
            view,
            page,
            chain,
          });
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
