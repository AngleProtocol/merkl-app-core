import type { Api } from "@core/api/types";
import type { Opportunity } from "@merkl/api";
import { defineModule } from "@merkl/conduit";
export type MorphoPayload = Awaited<ReturnType<Api["v3"]["morphoMarkets"]["get"]>>["data"];
//@ts-ignore: mixpanel did not bother using types :'/
import mixpanel from "mixpanel-browser";

export type MixpanelEvents = {
  "Click on Opportunity": Opportunity & { view: "table" | "cell" };
  "Check filters": object;
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

  return {
    init,
    track,
  };
});
