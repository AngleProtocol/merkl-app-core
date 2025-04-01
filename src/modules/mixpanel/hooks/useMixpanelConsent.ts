import { useCallback, useEffect, useState } from "react";
import { MixpanelService } from "../mixpanel.service";

const MIXPANEL_CONSENT_KEY = "mixpanel-consent";

export default function useMixpanelConsent() {
  const [consent, setConsentState] = useState<boolean | undefined>(
    typeof document === "undefined" ? undefined : window.localStorage.getItem(MIXPANEL_CONSENT_KEY) === "true",
  );

  const checkConsent = useCallback(() => {
    if (typeof document === "undefined") return;

    const consent = window.localStorage.getItem(MIXPANEL_CONSENT_KEY);

    setConsentState(consent === "true" ? true : consent === "false" ? false : undefined);
    return consent;
  }, []);

  const setConsent = useCallback((_consent: boolean) => {
    window.localStorage.setItem(MIXPANEL_CONSENT_KEY, `${_consent}`);
    MixpanelService({}).opt(_consent);
    setConsentState(_consent);
  }, []);

  useEffect(() => {
    checkConsent();
  }, [checkConsent]);

  return { consent, setConsent, checkConsent };
}
