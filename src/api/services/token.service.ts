import type { Token } from "@merkl/api";
import { api } from "../index.server";
import { fetchWithLogs } from "../utils";

export abstract class TokenService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Token",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  /**
   * Retrieves tokens query params from page request
   * @param request request containing query params such as pagination
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ) {
    const page = new URL(request.url).searchParams.get("page");
    const items = new URL(request.url).searchParams.get("items");
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

  static async getManyFromRequest(request: Request): Promise<{ tokens: Token[]; count: number }> {
    const query = TokenService.#getQueryFromRequest(request);
    const tokens = await TokenService.#fetch(async () => api.v4.tokens.index.get({ query }));
    const count = await TokenService.#fetch(async () => api.v4.tokens.count.get({ query }));

    return { tokens, count };
  }

  static async getMany(query: Parameters<typeof api.v4.tokens.index.get>[0]["query"]): Promise<Token[]> {
    const tokens = await TokenService.#fetch(async () => api.v4.tokens.index.get({ query }));

    return tokens;
  }

  static async findUniqueOrThrow(chainId: number, address: string) {
    return await TokenService.#fetch(async () => api.v4.tokens({ id: `${chainId}-${address}` }).get());
  }

  static async getSymbol(symbol: string | undefined): Promise<Token[]> {
    if (!symbol) throw new Response("Token not found");

    const tokens = await TokenService.#fetch(async () => api.v4.tokens.index.get({ query: { displaySymbol: symbol } }));

    if (tokens.length === 0) throw new Response("Token not found", { status: 404 });
    return tokens;
  }
}
