import type { Opportunity } from "@merkl/api";
import config from "merkl.config";
import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";
import { DEFAULT_ITEMS_PER_PAGE } from "../../constants/pagination";

export abstract class OpportunityService {
  static async getManyFromRequest(
    request: Request,
    overrides?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ) {
    return OpportunityService.getMany(Object.assign(OpportunityService.#getQueryFromRequest(request), overrides ?? {}));
  }
  // ─── Get Many Opportunities ──────────────────────────────────────────────

  static async getMany(
    query: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ): Promise<{ opportunities: Opportunity[]; count: number }> {
    //TODO: updates tags to take an array
    const overrideQuery = { ...query, sort: query.sort ?? config.opportunity.library.sortedBy };
    const opportunities = await OpportunityService.#fetch(async () =>
      api.v4.opportunities.index.get({
        query: Object.assign({ ...overrideQuery }, config.tags?.[0] ? { tags: config.tags?.[0] } : {}),
      }),
    );
    const count = await OpportunityService.#fetch(async () =>
      api.v4.opportunities.count.get({
        query: Object.assign({ ...overrideQuery }, config.tags?.[0] ? { tags: config.tags?.[0] } : {}),
      }),
    );

    return { opportunities: opportunities.filter(o => o !== null), count };
  }

  // ─── Get Featured opportunities ──────────────────────────────────────────────

  static async getFeatured(
    request: Request,
    overrides?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ): Promise<{ opportunities: Opportunity[]; count: number }> {
    if (config.opportunity.featured.enabled)
      return await OpportunityService.getMany(
        Object.assign(OpportunityService.#getQueryFromRequest(request), {
          items: config.opportunity.featured.length,
          ...overrides,
        }),
      );
    return { opportunities: [], count: 0 };
  }

  // ─── Get Opportunities with campaign ──────────────────────────────────────────────

  static async getCampaignsByParams(query: {
    chainId: number;
    type: string;
    identifier: string;
  }) {
    const { chainId, type, identifier } = query;
    const opportunityWithCampaigns = await OpportunityService.#fetch(async () =>
      api.v4.opportunities({ id: `${chainId}-${type}-${identifier}` }).campaigns.get({
        query: {
          test: config.alwaysShowTestTokens ?? false,
        },
      }),
    );

    // TODO: updates tags to take an array
    if (config.tags?.length && config.tags && !opportunityWithCampaigns.tags.includes(config.tags?.[0]))
      throw new Response("Opportunity inaccessible", { status: 403 });

    return opportunityWithCampaigns;
  }

  // ─── Get Aggregate ──────────────────────────────────────────────

  static async getAggregate(
    query: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
    params: "dailyRewards",
  ) {
    return await OpportunityService.#fetch(async () =>
      api.v4.opportunities.aggregate({ field: params }).get({ query }),
    );
  }

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
  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ) {
    const url = new URL(request.url);

    const filters = {
      status: url.searchParams.get("status") ?? undefined,
      mainProtocolId: url.searchParams.get("protocol") ?? url.searchParams.get("mainProtocolId") ?? undefined,
      action: url.searchParams.get("action") ?? undefined,
      chainId: url.searchParams.get("chain") ?? undefined,
      minimumTvl: url.searchParams.get("tvl") ?? undefined,
      items: url.searchParams.get("items") ? Number(url.searchParams.get("items")) : DEFAULT_ITEMS_PER_PAGE,
      sort: url.searchParams.get("sort")?.split("-")[0],
      order: url.searchParams.get("sort")?.split("-")[1],
      name: url.searchParams.get("search") ?? undefined,
      test: config.alwaysShowTestTokens ? true : (url.searchParams.get("test") ?? false),
      page: url.searchParams.get("page") ? Math.max(Number(url.searchParams.get("page")) - 1, 0) : undefined,
      ...override,
    };

    // Remove null/undefined values
    const query = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== null),
    );

    return query;
  }
}
