import config from "merkl.config";
import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";

export abstract class ClaimsService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Claims",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  // should be paginated
  static async getForUser(address: string) {
    const chainIds = config.chains?.map(({ id }) => id).join(",");
    const query: Record<string, string> = {};
    if (chainIds) query.chainIds = chainIds;
    return await ClaimsService.#fetch(async () => api.v4.claims({ address }).get({ query }));
  }
}
