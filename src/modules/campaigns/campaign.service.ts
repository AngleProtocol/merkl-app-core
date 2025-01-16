import type { Campaign } from "@merkl/api";
import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";
import merklConfig from "../../config";

export abstract class CampaignService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Opportunity",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.campaigns.index.get>[0]["query"],
  ) {
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

  // ------ Fetch all campaigns
  static async get() {
    const { data } = await api.v4.campaigns.index.get({ query: {} });

    return data;
  }

  static async getByOpportunity(request: Request, query: Parameters<typeof api.v4.campaigns.index.get>[0]["query"]) {
    return await CampaignService.#fetch(async () =>
      api.v4.campaigns.index.get({ query: CampaignService.#getQueryFromRequest(request, query) }),
    );
  }

  // ------ Fetch a campaign by ID
  static async getByID(_Id: string): Promise<Campaign | null> {
    return null;
  }
}
