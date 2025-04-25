import type { Api } from "@core/api/types";
import { type ApiQuery, type ApiResponse, fetchResource } from "@core/api/utils";
import { DEFAULT_ITEMS_PER_PAGE } from "@core/constants/pagination";
import type {
  OpportunityDeleteOverrideModel,
  OpportunityOverrideModel,
} from "@merkl/api/dist/src/modules/v4/opportunity/opportunity.model";
import { defineModule } from "@merkl/conduit";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";

export const OpportunityService = defineModule<{ api: Api; request: Request; backend: MerklBackendConfig }>().create(
  ({ inject }) => {
    const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Opportunity")(call);
    const queryFromRequest = inject(["backend", "request"]).inFunction(
      ({ backend, request }, override?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        const url = new URL(request.url);

        // TODO: Remove this art for a full search param handled by backend reository
        const searchString = url.searchParams.get("search");
        const campaignId = searchString?.startsWith("0x") && searchString.length === 66 ? searchString : undefined;
        // ------

        const filters = {
          status: campaignId
            ? undefined
            : (url.searchParams.get("status") ?? backend.opportunityDefaultStatus?.join(",") ?? undefined),
          mainProtocolId: url.searchParams.get("protocol") ?? url.searchParams.get("mainProtocolId") ?? undefined,
          action: url.searchParams.get("action") ?? undefined,
          chainId: url.searchParams.get("chain") ?? undefined,
          minimumTvl: url.searchParams.get("tvl") ?? undefined,
          items: url.searchParams.get("items") ? Number(url.searchParams.get("items")) : DEFAULT_ITEMS_PER_PAGE,
          sort: url.searchParams.get("sort")?.split("-")[0],
          order: url.searchParams.get("sort")?.split("-")[1],
          search: !!campaignId ? searchString : searchString,
          campaignId,
          test: backend.alwaysShowTestTokens ?? url.searchParams.get("test") === "true",
          point: backend.alwaysShowPointTokens ? true : (url.searchParams.get("point") ?? false),
          page: url.searchParams.get("page") ? Math.max(Number(url.searchParams.get("page")) - 1, 0) : undefined,
          tags: url.searchParams.get("tag") ?? undefined,
          ...override,
        };

        // Remove null/undefined values
        const query = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined && value !== null),
        );

        return query;
      },
    );

    const getManyFromRequest = inject(["api", "request", "backend"]).inFunction(
      ({ api, request, backend }, query?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        return getMany.handler(
          { api, backend },
          Object.assign(queryFromRequest.handler({ backend, request }), query ?? {}),
        );
      },
    );

    const getMany = inject(["api", "backend"]).inFunction(
      async ({ api, backend }, query: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        const overrideQuery = { ...query, sort: query.sort ?? backend.sortedBy };
        const opportunities = await fetchApi(async () =>
          api.v4.opportunities.index.get({
            headers: backend.showDevelopmentHelpers ? { "cache-control": "no-cache" } : undefined,
            query: Object.assign({ ...overrideQuery }, backend.tags?.[0] ? { tags: backend.tags?.[0] } : {}),
          }),
        );

        const count = await fetchApi(async () =>
          api.v4.opportunities.count.get({
            headers: backend.showDevelopmentHelpers ? { "cache-control": "no-cache" } : undefined,
            query: Object.assign({ ...overrideQuery }, backend.tags?.[0] ? { tags: backend.tags?.[0] } : {}),
          }),
        );

        return { opportunities: opportunities.filter(o => o !== null), count };
      },
    );

    const getFeatured = inject(["api", "request", "backend"]).inFunction(
      async ({ api, request, backend }, query?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
        if (backend.featured?.enabled)
          return await getMany.handler(
            { api, backend },
            Object.assign(queryFromRequest.handler({ backend, request }), {
              items: backend.featured.length,
              ...query,
            }),
          );
        return { opportunities: [], count: 0 };
      },
    );

    const reparse = inject(["api"]).inFunction(async ({ api }, opportunityId: string) => {
      await fetchApi(async () =>
        api.v4
          .opportunities({
            id: opportunityId,
          })
          .post(
            {},
            {
              headers: {
                authorization: `Bearer ${(window as { ENV?: { BACKOFFICE_SECRET?: string } })?.ENV?.BACKOFFICE_SECRET}`,
              },
            },
          ),
      );
    });

    const refreshMetadata = inject(["api"]).inFunction(async ({ api }, opportunityId: string) => {
      await fetchApi(async () =>
        api.v4.campaigns
          .tvls({
            opportunityId: opportunityId,
          })
          .put(
            {},
            {
              headers: {
                authorization: `Bearer ${(window as { ENV?: { BACKOFFICE_SECRET?: string } })?.ENV?.BACKOFFICE_SECRET}`,
              },
            },
          ),
      );
    });

    const override = inject(["api"]).inFunction(
      async ({ api }, opportunityId: string, override: OpportunityOverrideModel) => {
        await fetchApi(async () =>
          api.v4
            .opportunities({
              id: opportunityId,
            })
            .override.patch(override, {
              headers: {
                authorization: `Bearer ${(window as { ENV?: { BACKOFFICE_SECRET?: string } })?.ENV?.BACKOFFICE_SECRET}`,
              },
            }),
        );
      },
    );

    const deleteOverride = inject(["api"]).inFunction(
      async ({ api }, opportunityId: string, override: OpportunityDeleteOverrideModel) => {
        await fetchApi(async () =>
          api.v4
            .opportunities({
              id: opportunityId,
            })
            .override.delete(override, {
              headers: {
                authorization: `Bearer ${(window as { ENV?: { BACKOFFICE_SECRET?: string } })?.ENV?.BACKOFFICE_SECRET}`,
              },
            }),
        );
      },
    );

    const getCampaignsByParams = inject(["api", "backend", "request"]).inFunction(
      async (
        { api, backend, request },
        query: {
          chainId: number;
          type: string;
          identifier: string;
        },
      ) => {
        const url = new URL(request.url);
        const { chainId, type, identifier } = query;
        const opportunityWithCampaigns = await fetchApi(async () =>
          api.v4.opportunities({ id: `${chainId}-${type}-${identifier}` }).campaigns.get({
            headers: backend.showDevelopmentHelpers ? { "cache-control": "no-cache" } : undefined,
            query: {
              test: backend.alwaysShowTestTokens ?? url.searchParams.get("test") === "true",
              point: backend.alwaysShowPointTokens ?? url.searchParams.get("test") === "true",
            },
          }),
        );

        // TODO: updates tags to take an array
        if (backend.tags?.length && backend.tags && !opportunityWithCampaigns.tags.includes(backend.tags?.[0]))
          throw new Response("Opportunity inaccessible", { status: 403 });

        return opportunityWithCampaigns;
      },
    );

    const getAggregate = inject(["api", "backend"]).inFunction(
      ({ api, backend }, query: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>, params: "dailyRewards") => {
        return fetchApi(async () =>
          api.v4.opportunities
            .aggregate({ field: params })
            .get({ headers: backend.showDevelopmentHelpers ? { "cache-control": "no-cache" } : undefined, query }),
        );
      },
    );

    return {
      reparse,
      refreshMetadata,
      getMany,
      getAggregate,
      getManyFromRequest,
      getFeatured,
      getCampaignsByParams,
      override,
      deleteOverride,
    };
  },
);
