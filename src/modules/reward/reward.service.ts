import config from "merkl.config";
import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";
import { DEFAULT_ITEMS_PER_PAGE } from "../../constants/pagination";

export abstract class RewardService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Reward",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  /**
   * Retrieves query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getCampaignLeaderboardQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.rewards.index.get>[0]["query"],
  ) {
    const campaignId = new URL(request.url).searchParams.get("campaignId");
    const page = new URL(request.url).searchParams.get("page");
    const items = new URL(request.url).searchParams.get("items");

    const filters = Object.assign(
      {
        campaignId,
        items: items ?? DEFAULT_ITEMS_PER_PAGE,
        page,
      },
      override ?? {},
      page !== null && { page: Number(page) - 1 },
    );

    const query = Object.entries(filters).reduce(
      (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
      {},
    );

    return query;
  }

  static async getForUser(request: Request, address: string) {
    const url = new URL(request.url);

    const chainIds = config.chains?.map(({ id }) => id).join(",");

    // biome-ignore lint/suspicious/noExplicitAny: TODO
    const query: Record<string, any> = {
      test: config.alwaysShowTestTokens ? true : (url.searchParams.get("test") ?? false),
    };
    if (!!url.searchParams.get("chainId")) query.reloadChainId = url.searchParams.get("chainId");
    if (chainIds) query.chainIds = chainIds;
    return await RewardService.#fetch(async () =>
      api.v4.users({ address }).rewards.breakdowns.get({
        query,
      }),
    );
  }

  static #getTokenLeaderboardQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.rewards.token.get>[0]["query"],
  ) {
    const page = new URL(request.url).searchParams.get("page");
    const items = new URL(request.url).searchParams.get("items");

    const filters = Object.assign(
      {
        items: items ?? DEFAULT_ITEMS_PER_PAGE,
        page,
      },
      override ?? {},
      page !== null && { page: Number(page) - 1 },
    );

    const query = Object.entries(filters).reduce(
      (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
      {},
    );

    return query;
  }

  static async getTokenLeaderboard(
    request: Request,
    overrides?: Parameters<typeof api.v4.rewards.token.get>[0]["query"],
  ) {
    const query = Object.assign(RewardService.#getTokenLeaderboardQueryFromRequest(request), overrides ?? undefined);

    const promises = [
      RewardService.#fetch(async () =>
        api.v4.rewards.token.get({
          query,
        }),
      ),
      RewardService.#fetch(async () => api.v4.rewards.token.count.get({ query })),
      await RewardService.#fetch(async () => api.v4.rewards.token.total.get({ query })),
    ] as const;

    const [rewards, count, total] = await Promise.all(promises);

    return { count, rewards, total: total.amount };
  }

  static async getCampaignLeaderboard(
    request: Request,
    overrides?: Parameters<typeof api.v4.rewards.index.get>[0]["query"],
  ) {
    const query = Object.assign(RewardService.#getCampaignLeaderboardQueryFromRequest(request), overrides ?? undefined);

    const promises = [
      RewardService.#fetch(async () =>
        api.v4.rewards.index.get({
          query,
        }),
      ),
      RewardService.#fetch(async () => api.v4.rewards.count.get({ query })),
      await RewardService.#fetch(async () => api.v4.rewards.total.get({ query })),
    ] as const;

    const [rewards, count, total] = await Promise.all(promises);

    return { count, rewards, total: total.amount };
  }

  static async total(query: { chainId: number; campaignId: string }) {
    const total = await RewardService.#fetch(async () =>
      api.v4.rewards.total.get({
        query: {
          ...query,
          campaignId: query.campaignId,
        },
      }),
    );

    return total;
  }
}
