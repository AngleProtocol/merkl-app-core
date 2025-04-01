import { useMerklConfig } from "@core/modules/config/config.context";
import { Box, Button, Container, Group, Icon } from "packages/dappkit/src";
import useMixpanel from "../hooks/useMixpanel";
import useMixpanelConsent from "../hooks/useMixpanelConsent";
import useMixpanelPage from "../hooks/useMixpanelPage";

export default function Mixpanel() {
  const token = useMerklConfig(store => store.config.mixpanel?.token);

  useMixpanel(token);
  useMixpanelPage();

  const { consent, setConsent } = useMixpanelConsent();

  if (consent !== undefined) return;
  if (typeof document === "undefined") return;
  return (
    <>
      <div className="animate-drop fixed bottom-0 left-0 right-0 z-50 bg-black/50">
        <Container className="mb-xl w-[100vw] mx-auto p-sm">
          <Box className="justify-between flex-row items-center shadow-md shadow-accent-1">
            <div>
              We may collect logs of your interactions to improve our products. See{" "}
              <a
                className="text-accent-11 dim inline-flex gap-sm"
                href="https://app.merkl.xyz/privacy"
                target="_blank"
                rel="noopener noreferrer">
                privacy notice
                <Icon remix="RiArrowRightUpLine" />
              </a>
            </div>
            <Group>
              <Button onClick={() => setConsent(true)} className="rounded-md" look="hype">
                Allow
              </Button>
              <Button onClick={() => setConsent(false)} className="rounded-md" look="bold">
                Dismiss
              </Button>
            </Group>
          </Box>
        </Container>
      </div>
    </>
  );
}
