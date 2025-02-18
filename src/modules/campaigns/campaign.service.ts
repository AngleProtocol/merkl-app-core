import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import type { Campaign } from "@merkl/api";
import merklConfig from "../../config";

export abstract class CampaignService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Campaigns")(call);

  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request | undefined,
    override?: Parameters<typeof api.v4.campaigns.index.get>[0]["query"],
  ) {
    if (!request) return override;

    const status = new URL(request.url).searchParams.get("status");
    const action = new URL(request.url).searchParams.get("action");
    const chainId = new URL(request.url).searchParams.get("chain");
    const page = new URL(request.url).searchParams.get("page");
    const test = merklConfig.alwaysShowTestTokens ? true : (new URL(request.url).searchParams.get("test") ?? false);
    const items = new URL(request.url).searchParams.get("items");
    const search = new URL(request.url).searchParams.get("search");
    const [sort, order] = new URL(request.url).searchParams.get("sort")?.split("-") ?? [];

    const filters = Object.assign(
      { status, action, chainId, items, sort, order, name: search, page, test },
      override ?? {},
      page !== null && { page: Number(page) - 1 },
    );

    const query = Object.entries(filters).reduce(
      (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
      {},
    );

    return query;
  }

  /**
   * Ingest request to filter a /v4/campaigns fetch
   * @param request client request to the frontend server
   * @param query of api route (might get overwritten by request)
   * @returns an arr
   */
  static async getByOpportunity(
    request: Request | undefined,
    query: Parameters<typeof api.v4.campaigns.index.get>[0]["query"],
  ) {
    return await CampaignService.#fetch(
      async () => await api.v4.campaigns.index.get({ query: CampaignService.#getQueryFromRequest(request, query) }),
    );
  }

  static async getByID(_Id: string): Promise<Campaign | null> {
    return null;
  }
}
