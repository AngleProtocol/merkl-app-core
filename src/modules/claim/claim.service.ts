import { api } from "@core/api";
import { fetchWithLogs } from "@core/api/utils";
import merklConfig from "@core/config";

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
    const chainIds = merklConfig.chains?.map(({ id }) => id).join(",");
    const query: Record<string, string> = {};
    if (chainIds) query.chainIds = chainIds;
    return await ClaimsService.#fetch(async () => api.v4.claims({ address }).get({ query }));
  }

  // should be paginated
  static async getForUserFromRequest(request: Request, address: string) {
    const url = new URL(request.url);
    const chainIdsParams = url.searchParams.get("chain") ?? undefined;

    const chainIds =
      (merklConfig.chains?.length
        ? merklConfig.chains
            ?.map(({ id }) => id)
            ?.filter(id => chainIdsParams === undefined || chainIdsParams.split(",").includes(id.toString()))
            .join(",")
        : undefined) ?? chainIdsParams;
    const query: Record<string, string> = {};

    if (chainIds) query.chainIds = chainIds;
    return await ClaimsService.#fetch(async () => api.v4.claims({ address }).get({ query }));
  }
}
