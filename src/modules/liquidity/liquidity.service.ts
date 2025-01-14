import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";

export abstract class LiquidityService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Positions",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async getForUser(query: Parameters<typeof api.v4.liquidity.index.get>["0"]["query"]) {
    return await LiquidityService.#fetch(async () => api.v4.liquidity.index.get({ query }));
  }
}
