import type { Api } from "@core/api/types";
import type { Campaign, Chain, Opportunity } from "@merkl/api";
import { defineModule } from "@merkl/conduit";
export type MorphoPayload = Awaited<ReturnType<Api["v3"]["morphoMarkets"]["get"]>>["data"];
//@ts-ignore: mixpanel did not bother using types :'/
import mixpanel from "mixpanel-browser";
import type { MixpanelPageContext } from "./hooks/useMixpanelContext";

export type MixpanelEvents = {
  Page: { page: string };
  "Click on supply": Opportunity & { mode: "direct" | "indirect" };
  "Click on leadeboard": Campaign & Opportunity;
  "Click on opportunity": Opportunity & { view: "table" | "cell" };
  "Check filters": object;
  "Click on button": { type: string; button: string };
  "View page": object;
};

export const MixpanelService = defineModule<{ context: MixpanelPageContext; token: string }>().create(({ inject }) => {
  const init = inject(["token"]).inFunction(({ token }) => {
    mixpanel.init(token, {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
      ip: false,
      autocapture: false,
    });
  });

  const opt = (consent: boolean) => {
    if (!consent) return mixpanel.opt_out_tracking();
    return mixpanel.opt_in_tracking();
  };

  const track = (name: string, metadata: object) => {
    mixpanel.track(name, metadata);
  };

  const contextToProperties = inject(["context"]).inFunction(
    ({ context: { to, app_version } }: { context: MixpanelPageContext }) => {
      return {
        app_version,
        route: to.route,
        path: to.path,
        label: to.label,
        full_label: to.fullLabel,
      };
    },
  );

  const assign = (context: MixpanelPageContext, metadata: object) => {
    return Object.assign(contextToProperties.handler({ context }), metadata);
  };

  const trackPage = inject(["context"]).inFunction(
    ({ context: { from, to, app_version } }: { context: MixpanelPageContext }) => {
      mixpanel.track("page_viewed", {
        source_route: from === "nowhere" ? "nowhere" : from.route,
        source_path: from === "nowhere" ? "nowhere" : from.path,
        source_label: from === "nowhere" ? "nowhere" : from.label,
        source_full_label: from === "nowhere" ? "nowhere" : from.fullLabel,
        label: to.label,
        full_label: to.fullLabel,
        route: to.route,
        path: to.path,
        app_version,
      });
    },
  );

  const trackButton = inject(["context"]).inFunction(
    <M extends object>({ context }: { context: MixpanelPageContext }, button: string, type: string, metadata: M) => {
      mixpanel.track(
        "button_clicked",
        assign(context, {
          button,
          type,
          ...metadata,
        }),
      );
    },
  );

  const trackOpportunityButton = inject(["context"]).inFunction(
    <M extends object>(
      { context }: { context: MixpanelPageContext },
      button: string,
      type: string,
      metadata: M,
      { chainId, status, protocol, tokens, action }: Opportunity,
      chains: Chain[],
    ) => {
      const chain = chains?.find(c => c.id === chainId)?.name?.toLowerCase();
      const tkns = tokens?.reduce(
        (obj, { symbol }, index) => {
          obj[`token${index}`] = symbol;
          return obj;
        },
        {} as { [key: string]: string },
      );

      trackButton.handler({ context }, button, type, {
        status,
        action,
        protocol: protocol?.id,
        ...tkns,
        chain,
        ...metadata,
      });
    },
  );

  return {
    init,
    track,
    trackButton,
    trackOpportunityButton,
    contextToProperties,
    trackPage,
    opt,
  };
});
