import { useMerklConfig } from "@core/modules/config/config.context";
import { useEffect } from "react";
import useMixpanelContext from "./useMixpanelContext";
import useMixpanelTracking from "./useMixpanelTracking";

export default function useMixpanelWallet() {
  const context = useMixpanelContext();
  const { track } = useMixpanelTracking();
  const mixpanelConfiguration = useMerklConfig(store => store.config.mixpanel);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (typeof document === "undefined" || !mixpanelConfiguration?.token) return;

    track("View page", {});
  }, [context]);

  return {};
}
