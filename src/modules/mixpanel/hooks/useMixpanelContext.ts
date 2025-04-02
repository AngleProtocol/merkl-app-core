import { useMerklConfig } from "@core/modules/config/config.context";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { useLocation, useNavigation } from "react-router";
import { useEffect, useState } from "react";

type PageId = { path: string; route: string; label: string; fullLabel: string };
export type MixpanelPageContext = {
  from: PageId | "nowhere";
  to: PageId;
  app_version?: string;
};

export default function useMixpanelContext(): MixpanelPageContext {
  const routes = useMerklConfig(store => store.config.routes);
  const location = useLocation();
  const navigation = useNavigation();

  const [previousState, setPreviousState] = useState<(typeof navigation)["state"]>("idle");
  const [pageNavigation, setPageNavigation] = useState<MixpanelPageContext>({
    from: "nowhere",
    to: MetadataService({ location }).findAbstractRoute(routes, "/"),
  });
  const [previousPage, setPreviousPage] = useState<PageId>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: restricting state changes
  useEffect(() => {
    const currentState = navigation.state;
    const page = MetadataService({ location }).findAbstractRoute(routes, "/");

    if (currentState === "idle" && previousState === "loading") {
      setPageNavigation({ from: previousPage ?? "nowhere", to: page });
    }

    setPreviousState(navigation.state);
    setPreviousPage(page);
  }, [navigation.state]);

  return {
    ...pageNavigation,
    // biome-ignore lint/suspicious/noExplicitAny: @todo embed env type definition after react-router upgrade
    app_version: typeof document !== "undefined" && ((window as any)?.ENV! as any)?.MERKL_VERSION,
  };
}
