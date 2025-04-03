import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";

export const StatusService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Status")(call);

  const getStatusAndDelays = inject(["api"]).inFunction(({ api }) => {
    return fetchApi(async () => api.v4["campaign-status"].delay.status.get());
  });

  return {
    getStatusAndDelays,
  };
});
