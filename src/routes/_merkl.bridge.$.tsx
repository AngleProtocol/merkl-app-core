import type { MetaFunction } from "@remix-run/node";
import config from "merkl.config";
import { Button, Group, Icon, Space, Text } from "packages/dappkit/src";
import { Suspense } from "react";
import { I18n } from "src/I18n";
import { LiFiWidget } from "src/components/composite/LiFiWidget.client";

export const meta: MetaFunction = () => {
  return [{ title: I18n.trad.get.pages.bridge.headTitle }];
};

export default function Index() {
  return (
    <>
      {!!I18n.trad.get.pages.bridge.helper && (
        <>
          <Space size="xl" />
          <Group className="border-1 rounded-lg p-md border-accent-8 flex-wrap items-center w-[90vw] m-auto">
            <Text look="bold">
              <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
              {I18n.trad.get.pages.bridge.helper}
            </Text>
            {!!config.bridge.helperLink && (
              <Button to={config.bridge.helperLink} external look="tint">
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
    </>
  );
}
