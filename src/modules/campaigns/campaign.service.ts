import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import type { MerklBackendConfig } from "@core/index.generated";
import { defineModule } from "@merkl/conduit";

export const CampaignService = defineModule<{ backend: MerklBackendConfig; request: Request; api: Api }>().create(
  ({ inject }) => {
    const fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Campaigns")(call);

    /**
     *
     */
    const getQueryFromRequest = inject(["backend", "request"]).inFunction(
      ({ request, backend }, override?: Parameters<Api["v4"]["campaigns"]["index"]["get"]>[0]["query"]) => {
        if (!request) return override ?? {};
        const url = new URL(request.url);

        const status = url.searchParams.get("status");
        const action = url.searchParams.get("action");
        const chainId = url.searchParams.get("chain");
        const page = url.searchParams.get("page");
        const test = backend.alwaysShowTestTokens ?? url.searchParams.get("test") === "true";
        const point = backend.alwaysShowPointTokens ? true : (url.searchParams.get("point") ?? false);
        const items = url.searchParams.get("items");
        const search = url.searchParams.get("search");
        const [sort, order] = url.searchParams.get("sort")?.split("-") ?? [];

        const filters = Object.assign(
          { status, action, chainId, items, sort, order, name: search, page, test, point },
          override ?? {},
          page !== null && { page: Number(page) - 1 },
        );

        const query = Object.entries(filters).reduce(
          (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
          {},
        );

        return query;
      },
    );

    /**
     * Ingest request to filter a /v4/campaigns fetch
     * @param request client request to the frontend server
     * @param query of api route (might get overwritten by request)
     * @returns an arr
     */
    const getByOpportunity = inject(["api"]).inFunction(
      async ({ api }, query: Parameters<Api["v4"]["campaigns"]["index"]["get"]>[0]["query"]) => {
        return await fetch(async () => await api.v4.campaigns.index.get({ query: { ...query, test: true } }));
      },
    );

    /**
     * Ingest request to filter a /v4/campaigns fetch
     * @param request client request to the frontend server
     * @param query of api route (might get overwritten by request)
     * @returns an arr
     */
    const getByOpportunityFromRequest = inject(["backend", "request", "api"]).inFunction(
      async ({ backend, request, api }, query: Parameters<Api["v4"]["campaigns"]["index"]["get"]>[0]["query"]) => {
        return await fetch(
          async () =>
            await api.v4.campaigns.index.get({ query: getQueryFromRequest.handler({ backend, request }, query) }),
        );
      },
    );

    return { getByOpportunity, getByOpportunityFromRequest };
  },
);
