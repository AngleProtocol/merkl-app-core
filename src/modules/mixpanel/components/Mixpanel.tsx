import { useMerklConfig } from "@core/modules/config/config.context";
import useMixpanel from "../hooks/useMixpanel";
import useMixpanelPage from "../hooks/useMixpanelPage";

export default function Mixpanel() {
  const token = useMerklConfig(store => store.config.mixpanel?.token);

  useMixpanel(token);
  useMixpanelPage();
  return null;
}
