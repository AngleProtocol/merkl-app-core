import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";

export type Payload = Awaited<ReturnType<typeof api.v3.payload.get>>["data"];

export abstract class MorphoService {
  // ─── Get a morpho markets ──────────────────────────────────────────────
  static async getMarkets(query: Parameters<typeof api.v3.morphoMarkets.get>[0]["query"]) {
    return await MorphoService.#fetch(async () =>
      api.v3.morphoMarkets.get({
        query: Object.assign({ ...query }),
      }),
    );
  }

  // ─── Get a morpho vaults ──────────────────────────────────────────────
  static async getVaults(query: Parameters<typeof api.v3.morphoVaults.get>[0]["query"]) {
    return await MorphoService.#fetch(async () =>
      api.v3.morphoVaults.get({
        query: Object.assign({ ...query }),
      }),
    );
  }

  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Morpho Markets",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }
}
