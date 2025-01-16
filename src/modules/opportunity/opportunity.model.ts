import type { Opportunity as OpportunityFromApi } from "@merkl/api";
import type { Fetched } from "../../api/types";
import type { Campaign } from "../campaigns/campaign.model";

export type Opportunity = OpportunityFromApi;
export type OpportunityWithCampaigns = Fetched<OpportunityFromApi & { campaigns: Campaign[] }>;
