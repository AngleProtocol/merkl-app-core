import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";

export abstract class StatusService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Chain")(call);

  static async getStatusAndDelays() {
    const status = await StatusService.#fetch(async () => api.v4["campaign-status"].delay.status.get());
    return status;
  }
}
