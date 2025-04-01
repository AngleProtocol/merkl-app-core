import { useMerklConfig } from "@core/modules/config/config.context";
import { Box, Button, Container, Group, Icon, Text } from "packages/dappkit/src";
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
        <Container className="mb-xl md:max-w-[70vw] w-[100vw] mx-auto p-sm">
          <Box className="bg-main-1 grid grid-cols-1 md:grid-cols-[1fr,min-content] items-center shadow-md shadow-accent-1">
            <Text size="xs">
              We may collect logs of your interactions to improve our products. See{" "}
              <a
                className="text-accent-11 dim inline-flex gap-sm"
                href="https://app.merkl.xyz/privacy"
                target="_blank"
                rel="noopener noreferrer">
                privacy notice
                <Icon remix="RiArrowRightUpLine" />
              </a>
            </Text>
            <Group size="sm" className="md:flex md:flex-nowrap grid grid-cols-2 grid-wrap">
              <Button size="xs" onClick={() => setConsent(true)} className="rounded-md justify-center" look="hype">
                Allow
              </Button>
              <Button size="xs" onClick={() => setConsent(false)} className="rounded-md justify-center" look="bold">
                Dismiss
              </Button>
            </Group>
          </Box>
        </Container>
      </div>
    </>
  );
}
