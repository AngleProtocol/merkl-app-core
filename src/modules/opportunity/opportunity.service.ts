import type { Api } from "@core/api/types";
import { type ApiQuery, type ApiResponse, fetchResource } from "@core/api/utils";
import merklConfig from "@core/config";
import type { MerklServer } from "@core/config/server";
import { DEFAULT_ITEMS_PER_PAGE } from "@core/constants/pagination";
import type { Opportunity } from "@merkl/api";
import { defineModule } from "@merkl/conduit";

export const OpportunityService = defineModule<{ api: Api; request: Request; server: MerklServer }>().create(
  ({ inject }) => {
    const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Opportunity")(call);
    const queryFromRequest = (request: Request, override?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
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
        test: merklConfig.alwaysShowTestTokens ? true : (url.searchParams.get("test") ?? false),
        page: url.searchParams.get("page") ? Math.max(Number(url.searchParams.get("page")) - 1, 0) : undefined,
        ...override,
      };

      // Remove null/undefined values
      const query = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== null),
      );

      return query;
    };

    const getManyFromRequest = inject(["api", "request", "server"]).inFunction(
      ({ api, request, server }, query?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        return getMany.handler({ api, server }, Object.assign(queryFromRequest(request), query ?? {}));
      },
    );

    const getMany = inject(["api", "server"]).inFunction(
      async ({ api, server }, query: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        const overrideQuery = { ...query, sort: query.sort ?? server.sortedBy };
        const opportunities = await fetchApi(async () =>
          api.v4.opportunities.index.get({
            query: Object.assign({ ...overrideQuery }, server.tags?.[0] ? { tags: server.tags?.[0] } : {}),
          }),
        );
        const count = await fetchApi(async () =>
          api.v4.opportunities.count.get({
            query: Object.assign({ ...overrideQuery }, server.tags?.[0] ? { tags: server.tags?.[0] } : {}),
          }),
        );

        return { opportunities: opportunities.filter(o => o !== null), count };
      },
    );

    const getFeatured = inject(["api", "request", "server"]).inFunction(
      async ({ api, request, server }, query?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        if (server.featured?.enabled)
          return await getMany.handler(
            { api, server },
            Object.assign(queryFromRequest(request), {
              items: server.featured.length,
              ...query,
            }),
          );
        return { opportunities: [], count: 0 };
      },
    );

    const getCampaignsByParams = inject(["api", "server"]).inFunction(
      async (
        { api, server },
        query: {
          chainId: number;
          type: string;
          identifier: string;
        },
      ) => {
        const { chainId, type, identifier } = query;
        const opportunityWithCampaigns = await fetchApi(async () =>
          api.v4.opportunities({ id: `${chainId}-${type}-${identifier}` }).campaigns.get({
            query: {
              test: server.alwaysShowTestTokens ?? false,
            },
          }),
        );

        // TODO: updates tags to take an array
        if (server.tags?.length && server.tags && !opportunityWithCampaigns.tags.includes(server.tags?.[0]))
          throw new Response("Opportunity inaccessible", { status: 403 });

        return opportunityWithCampaigns;
      },
    );

    const getAggregate = inject(["api"]).inFunction(
      ({ api }, query: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>, params: "dailyRewards") => {
        return fetchApi(async () => api.v4.opportunities.aggregate({ field: params }).get({ query }));
      },
    );

    const getDescription = (opportunity: Pick<Opportunity, "tokens" | "protocol" | "chain" | "action">) => {
      const symbols = opportunity.tokens?.map(t => t.symbol).join("-");

      switch (opportunity.action) {
        case "POOL":
          return `Earn rewards by providing liquidity to the ${opportunity.protocol?.name} ${symbols} pool on ${opportunity.chain.name}, or through a liquidity manager supported by Merkl`;
        case "HOLD":
          return `Earn rewards by holding ${symbols} or by staking it in a supported contract`;
        case "LEND":
          return `Earn rewards by supplying liquidity to the ${opportunity.protocol?.name} ${symbols} on ${opportunity.chain.name}`;
        case "BORROW":
          return `Earn rewards by borrowing liquidity to the ${opportunity.protocol?.name} ${symbols} on ${opportunity.chain.name}`;
        case "DROP":
          return `Visit your dashboard to check if you've earned rewards from this airdrop`;
        default:
          break;
      }
    };

    return {
      getMany,
      getAggregate,
      getManyFromRequest,
      getDescription,
      getFeatured,
      getCampaignsByParams,
    };
  },
);
