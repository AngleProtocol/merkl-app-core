import { useMerklConfig } from "@core/modules/config/config.context";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import\b.*react-router";
import { Button, Container, Group, Icon, Space, Text } from "dappkit";
import { Suspense } from "react";
import { I18n } from "../../../I18n";
import { LiFiWidget } from "../../../components/composite/LiFiWidget.client";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ request, backend, routes }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const bridgeHelperLink = useMerklConfig(store => store.config.bridge.helperLink);

  return (
    <>
      <Container>
        {!!I18n.trad.get.pages.bridge.helper && (
          <>
            <Space size="lg" />
            <Group className="border-1 rounded-lg p-md border-accent-8 flex-wrap text-center items-center w-fit m-auto justify-center">
              <Text look="bold">
                <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
                {I18n.trad.get.pages.bridge.helper}
              </Text>
              {!!bridgeHelperLink && (
                <Button to={bridgeHelperLink} external look="tint">
                  Bridge now
                </Button>
              )}
            </Group>
          </>
        )}
        <Space size="xl" />
        <Suspense
          fallback={
            <Group className="justify-center w-full">
              <Icon remix="RiLoader2Line" className="animate-spin text-main-12" />
            </Group>
          }>
          <LiFiWidget />
        </Suspense>
      </Container>
    </>
  );
}
