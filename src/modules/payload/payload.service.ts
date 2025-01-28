import { api } from "../../api";
import { fetchWithLogs } from "../../api/utils";

// type Payload = Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"];
export type Payload = Awaited<ReturnType<typeof api.v3.payload.get>>["data"];

export abstract class PayloadService {
  // ─── Get a payload ──────────────────────────────────────────────
  static async get(query: Parameters<typeof api.v3.payload.get>[0]["query"]) {
    return await PayloadService.#fetch(async () =>
      api.v3.payload.get({
        query: Object.assign({ ...query }),
      }),
    );
  }

  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Payload",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }
}
