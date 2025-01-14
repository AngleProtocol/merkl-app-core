import type { Chain } from "@merkl/api";
import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";

export abstract class ChainService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Chain",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async getAll() {
    const chains = await ChainService.#fetch(async () => api.v4.chains.index.get({ query: {} }));

    //TODO: add some cache here
    return chains;
  }

  static async getMany(query: Parameters<typeof api.v4.chains.index.get>[0]["query"]): Promise<Chain[]> {
    const chains = await ChainService.#fetch(async () => api.v4.chains.index.get({ query }));

    //TODO: add some cache here
    return chains;
  }

  static async get(query: Parameters<typeof api.v4.chains.index.get>[0]["query"]): Promise<Chain> {
    const chains = await ChainService.#fetch(async () =>
      api.v4.chains.index.get({
        query: {
          name: query.name?.replace("-", " "),
        },
      }),
    );

    if (chains.length === 0) throw new Response("Chain not found", { status: 404 });

    //TODO: add some cache here
    return chains?.[0];
  }
}
