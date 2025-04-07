import type { Campaign as CampaignFromApi, CampaignParams } from "@merkl/api";

export type Campaign<C extends CampaignFromApi["type"] = CampaignFromApi["type"]> = CampaignFromApi<C> & {
  params: CampaignParams<C>["params"];
};
