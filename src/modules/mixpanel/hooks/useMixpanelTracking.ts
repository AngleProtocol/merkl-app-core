import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { useWalletContext } from "dappkit";
import { useCallback } from "react";
import { type MixpanelEvents, MixpanelService } from "../mixpanel.service";
import useMixpanelContext from "./useMixpanelContext";

export default function useMixpanelTracking() {
  const mixpanelConfiguration = useMerklConfig(store => store.config.mixpanel);
  const { chains } = useWalletContext();
  const context = useMixpanelContext();

  const track = useCallback(
    <const Event extends keyof MixpanelEvents>(event: Event, data: MixpanelEvents[Event]) => {
      if (!mixpanelConfiguration || !mixpanelConfiguration.token) return;

      const events: { [E in keyof MixpanelEvents]: (_data: MixpanelEvents[E]) => void } = {
        "View page": () => {
          MixpanelService({ context }).trackPage();
        },
        "Click on opportunity": ({ view, ...opportunity }) => {
          MixpanelService({ context }).trackOpportunityButton(
            "opportunity",
            "none",
            {
              view,
            },
            opportunity,
            chains,
          );
        },
        "Click on button": ({ button, type, ...rest }) => {
          MixpanelService({ context }).trackButton(button, type, rest ?? {});
        },
        "Click on opportunity button": ({ button, type, opportunity }) => {
          MixpanelService({ context }).trackOpportunityButton(button, type, {}, opportunity as Opportunity, chains);
        },
        "Click on supply": ({ mode, ...opportunity }) => {
          MixpanelService({ context }).trackOpportunityButton("supply", mode, {}, opportunity, chains);
        },
        "Click on leaderboard": ({ view, ...opportunity }) => {
          MixpanelService({ context }).trackOpportunityButton(
            "leaderboard",
            "campaign",
            {
              view,
            },
            opportunity,
            chains,
          );
        },
        "Check filters": params => MixpanelService({ context }).trackButton("check", "check_filters", params),
      };

      return events[event]?.(data);
    },
    [mixpanelConfiguration, chains, context],
  );

  return {
    enabled: !!mixpanelConfiguration,
    track,
  };
}
