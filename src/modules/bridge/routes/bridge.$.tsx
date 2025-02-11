import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Button, Container, Group, Icon, Space, Text } from "dappkit";
import { Suspense } from "react";
import { I18n } from "../../../I18n";
import { LiFiWidget } from "../../../components/composite/LiFiWidget.client";
import merklConfig from "../../../config";
import { withUrl } from "@core/utils/url";

export async function loader({ request }: LoaderFunctionArgs) {
  return withUrl(request);
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("bridge", [data?.url, merklConfig]);
};

export default function Index() {
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
              {!!merklConfig.bridge.helperLink && (
                <Button to={merklConfig.bridge.helperLink} external look="tint">
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
