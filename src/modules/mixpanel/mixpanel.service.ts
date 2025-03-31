import type { Api } from "@core/api/types";
import type { Opportunity, Campaign, Chain } from "@merkl/api";
import { defineModule } from "@merkl/conduit";
export type MorphoPayload = Awaited<ReturnType<Api["v3"]["morphoMarkets"]["get"]>>["data"];
//@ts-ignore: mixpanel did not bother using types :'/
import mixpanel from "mixpanel-browser";

export type MixpanelEvents = {
  Page: { page: string };
  "Click on supply": Opportunity & { url: string } & { page: string; mode: "direct" | "indirect" };
  "Click on leadeboard": Campaign & Opportunity;
  "Click on opportunity": Opportunity & { view: "table" | "cell" } & { page: string };
  "Check filters": object;
  "Click on button": { page: string; type: string; button: string };
};

export const MixpanelService = defineModule<{ token: string }>().create(({ inject }) => {
  const init = inject(["token"]).inFunction(({ token }) => {
    mixpanel.init(token, {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
      ip: false,
    });
  });

  const track = (name: string, metadata: object) => {
    mixpanel.track(name, metadata);
  };

  const trackButton = <M extends { page: string }>(button: string, type: string, metadata: M) => {
    mixpanel.track(
      "button_clicked",
      Object.assign({
        button,
        type,
        ...metadata,
        app_version: typeof document !== "undefined" && ((window as any)?.ENV! as any)?.MERKL_VERSION,
      }),
    );
  };

  const trackOpportunityButton = <M extends { page: string }>(
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

    trackButton(button, type, {
      status,
      action,
      protocol: protocol?.id,
      ...tkns,
      chain,
      ...metadata,
    });
  };

  return {
    init,
    track,
    trackButton,
    trackOpportunityButton
  };
});
