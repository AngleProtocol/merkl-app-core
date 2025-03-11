import type { Api } from "@core/api/types";
import { type ApiQuery, type ApiResponse, fetchResource } from "@core/api/utils";
import type { MerklBackend } from "@core/config/backend";
import { DEFAULT_ITEMS_PER_PAGE } from "@core/constants/pagination";
import { defineModule } from "@merkl/conduit";

export const RewardService = defineModule<{ api: Api; request: Request; backend: MerklBackend }>().create(
  ({ inject }) => {
    const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Reward")(call);
    const campaignLeaderboardQueryFromRequest = (
      request: Request,
      override?: ApiQuery<Api["v4"]["rewards"]["index"]["get"]>,
    ) => {
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
    };

    const getForUser = inject(["api", "backend", "request"]).inFunction(({ api, backend, request }, address: string) => {
      const url = new URL(request.url);

      const chainIds = backend.chains?.map(({ id }) => id).join(",");

      // biome-ignore lint/suspicious/noExplicitAny: TODO
      const query: Record<string, any> = {
        test: backend.alwaysShowTestTokens ? true : (url.searchParams.get("test") ?? false),
      };
      if (!!url.searchParams.get("chainId")) query.reloadChainId = url.searchParams.get("chainId");
      if (chainIds) query.chainIds = chainIds;
      return fetchApi(() => api.v4.users({ address }).rewards.breakdowns.get({ query }));
    });

    const getTokenLeaderboard = inject(["api", "request"]).inFunction(
      async ({ api, request }, overrides?: ApiQuery<Api["v4"]["rewards"]["token"]["index"]["get"]>) => {
        const query = Object.assign(campaignLeaderboardQueryFromRequest(request), overrides ?? undefined);

        const promises = [
          fetchApi(async () =>
            api.v4.rewards.token.index.get({
              query,
            }),
          ),
          fetchApi(async () => api.v4.rewards.token.count.get({ query })),
          fetchApi(async () => api.v4.rewards.token.total.get({ query })),
        ] as const;

        const [rewards, count, total] = await Promise.all(promises);

        return { count, rewards, total: total.amount };
      },
    );

    const getCampaignLeaderboard = inject(["api", "request"]).inFunction(
      async ({ api, request }, overrides: ApiQuery<Api["v4"]["rewards"]["index"]["get"]>) => {
        const query = Object.assign(campaignLeaderboardQueryFromRequest(request), overrides ?? undefined);

        const promises = [
          fetchApi(async () =>
            api.v4.rewards.index.get({
              query,
            }),
          ),
          fetchApi(async () => api.v4.rewards.count.get({ query })),
          fetchApi(async () => api.v4.rewards.total.get({ query })),
        ] as const;

        const [rewards, count, total] = await Promise.all(promises);

        return { count, rewards, total: total.amount };
      },
    );

    const total = inject(["api"]).inFunction(({ api }, query: { chainId: number; campaignId: string }) => {
      return fetchApi(() =>
        api.v4.rewards.total.get({
          query: {
            ...query,
            campaignId: query.campaignId,
          },
        }),
      );
    });

    return {
      getForUser,
      getTokenLeaderboard,
      getCampaignLeaderboard,
      total,
    };
  },
);
