import { Group, Icon, Text, Title } from "dappkit";
import ThemeProvider from "dappkit/src/context/Theme.context";
import { isRouteErrorResponse, useRouteError } from "react-router";
import AppProviders from "./app/providers";
import Hero from "./components/composite/Hero";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import type { MerklConfig } from "./modules/config/config.model";

export default function RootErrorBoundary(config: Pick<MerklConfig, "theme">) {
  return () => {
    const error = useRouteError();
    const notARoute = isRouteErrorResponse(error) && error.status === 404;

    //Log error in hosted console
    !notARoute && console.error(error);

    if (notARoute)
      return (
        <AppProviders config={config}>
          <Group size="xl" className="!gap-0 min-h-screen !flex-nowrap flex-col">
            <Header />
            <main className="flex-1 h-full flex flex-col">
              <Hero
                className="h-full"
                // icons={[{ remix: "RiPlanetFill" }]}
                navigation={{ label: "Back to opportunities", link: "/" }}
                title={"Oops!"}
                description={"The page you are looking for no longer exists"}
              />
              <div className="h-full justify-center flex-1 flex flex-col items-center">
                <div className="bg-main-12  p-xl*4 border-[10px] h-full border-main-6 aspect-square max-w-[96px] min-w-[96px] max-h-[96px] min-h-[96px] mx-auto flex items-center justify-center !rounded-[10000px]">
                  <Title h={3} className="text-main-2">
                    404
                  </Title>
                </div>
              </div>
            </main>
            <Footer />
          </Group>
        </AppProviders>
      );
    return (
      <ThemeProvider sizing={config.theme.sizing} themes={config.theme.themes} modes={config.theme.modes}>
        <Group className="h-[100vh] flex-col justify-center m-auto w-min">
          <Title h={1} className="flex flex-nowrap flex-col">
            <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
            An unexpected error occured
          </Title>
          <Text className="text-center">Please wait until the issue is resolved</Text>
        </Group>
      </ThemeProvider>
    );
  };
}
