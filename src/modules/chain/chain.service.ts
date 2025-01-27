import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import type { Chain } from "@merkl/api";

export abstract class ChainService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Chain")(call);

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

  static async getById(chainId: number): Promise<Chain> {
    return await ChainService.#fetch(async () => api.v4.chains({ chainId }).get());
  }
}
