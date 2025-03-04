import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";
import merklConfig from "../../config";
export const DEFAULT_ITEMS_PER_PAGE_PROTOCOLS = 500;
export abstract class ProtocolService {
  // ─── Get Many Protocols ──────────────────────────────────────────────

  static async get(query: Parameters<typeof api.v4.protocols.index.get>[0]["query"]) {
    return await ProtocolService.#fetch(async () =>
      api.v4.protocols.index.get({
        query: Object.assign({ ...query }, merklConfig.tags?.[0] ? { opportunityTag: merklConfig.tags?.[0] } : {}),
      }),
    );
  }

  // ─── Get First Protocol ──────────────────────────────────────────────

  static async getById(id: string) {
    return await ProtocolService.#fetch(async () =>
      api.v4
        .protocols({
          id,
        })
        .get(),
    );
  }

  // ─── Get Many Protocols from request ──────────────────────────────────

  static async getManyFromRequest(request: Request) {
    const query: Parameters<typeof api.v4.protocols.index.get>[0]["query"] =
      ProtocolService.#getQueryFromRequest(request);
    const protocols = await ProtocolService.#fetch(async () =>
      api.v4.protocols.index.get({
        query: Object.assign({ ...query }, merklConfig.tags?.[0] ? { opportunityTag: merklConfig.tags?.[0] } : {}),
      }),
    );
    const count = await ProtocolService.#fetch(async () =>
      api.v4.protocols.count.get({
        query: Object.assign({ ...query }, merklConfig.tags?.[0] ? { opportunityTag: merklConfig.tags?.[0] } : {}),
      }),
    );

    return { protocols, count };
  }

  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Protocol",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  /**
   * Retrieves protocols query params from page request
   * @param request request containing query params such as paginatio
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ) {
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
  }
}
