import { api } from "@core/api";
import { fetchWithLogs } from "@core/api/utils";

export abstract class StatusService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Delays",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async getStatusAndDelays() {
    const status = await StatusService.#fetch(async () => api.v4["campaign-status"].delay.status.get());
    return status;
  }
}
