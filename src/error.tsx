import { isRouteErrorResponse, useNavigate, useRouteError } from "@remix-run/react";
import { Group, Icon, Text, Title } from "packages/dappkit/src";
import ThemeProvider from "packages/dappkit/src/context/Theme.context";
import { useEffect } from "react";
import type { MerklConfig } from "./modules/config/config.model";

export default function RootErrorBoundary(config: Pick<MerklConfig, "theme">) {
  return () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const notARoute = isRouteErrorResponse(error) && error.status === 404;
    console.error(error);

    useEffect(() => {
      if (isRouteErrorResponse(error) && error.status === 404) return navigate("/");
    }, [error, navigate]);

    if (notARoute)
      return (
        <ThemeProvider
          sizing={config.theme.sizing}
          themes={config.theme.themes}
          modes={config.theme.modes}>
          <Group className="h-[100vh] flex-col justify-center m-auto w-min">
            <Title h={1} className="flex flex-nowrap flex-col">
              <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
              Invalid Url
            </Title>
            <Text className="text-center w-full">Redirecting...</Text>
          </Group>
        </ThemeProvider>
      );
    return (
      <ThemeProvider
        sizing={config.theme.sizing}
        themes={config.theme.themes}
        modes={config.theme.modes}>
        <Group className="h-[100vh] flex-col justify-center m-auto w-min">
          <Title h={1} className="flex flex-nowrap flex-col">
            <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
            An Error occured
          </Title>
          <Text className="text-center">Please wait until the issue is resolved</Text>
        </Group>
      </ThemeProvider>
    );
  };
}
