import type { Api } from "@core/api/types";
import type { MerklServer } from "@core/config/server";
import { defineModule } from "@merkl/conduit";
import { type ApiQuery, type ApiResponse, fetchResource } from "../../api/utils";
export const DEFAULT_ITEMS_PER_PAGE_PROTOCOLS = 500;

export const ProtocolService = defineModule<{ api: Api; server: MerklServer; request: Request }>().create(
  ({ inject }) => {
    const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Protocol")(call);
    const queryFromRequest = (request: Request, override?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
      const page = new URL(request.url).searchParams.get("page");
      const items = new URL(request.url).searchParams.get("items") ?? DEFAULT_ITEMS_PER_PAGE_PROTOCOLS;
      const search = new URL(request.url).searchParams.get("search");

      const [sort, order] = new URL(request.url).searchParams.get("sort")?.split("-") ?? [];

      const filters = Object.assign(
        { items, sort, order, name: search, page },
        override ?? {},
        page !== null && { page: Number(page) - 1 },
      );

      const query = Object.entries(filters).reduce(
        (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
        {},
      );

      return query;
    };

    const get = inject(["api", "server"]).inFunction(
      ({ api, server }, query: ApiQuery<Api["v4"]["protocols"]["index"]["get"]>) => {
        return fetchApi(() =>
          api.v4.protocols.index.get({
            query: Object.assign({ ...query }, server.tags?.[0] ? { opportunityTag: server.tags?.[0] } : {}),
          }),
        );
      },
    );

    const getById = inject(["api"]).inFunction(({ api }, id: string) => {
      return fetchApi(() =>
        api.v4
          .protocols({
            id,
          })
          .get(),
      );
    });

    const getManyFromRequest = inject(["api", "request", "server"]).inFunction(async ({ api, request, server }) => {
      const query: Parameters<typeof api.v4.protocols.index.get>[0]["query"] = queryFromRequest(request);
      const protocols = await fetchApi(async () =>
        api.v4.protocols.index.get({
          query: Object.assign({ ...query }, server.tags?.[0] ? { opportunityTag: server.tags?.[0] } : {}),
        }),
      );
      const count = await fetchApi(async () =>
        api.v4.protocols.count.get({
          query: Object.assign({ ...query }, server.tags?.[0] ? { opportunityTag: server.tags?.[0] } : {}),
        }),
      );

      return { protocols, count };
    });

    return {
      get,
      getById,
      getManyFromRequest,
    };
  },
);
