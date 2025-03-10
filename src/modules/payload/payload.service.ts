import type { Api } from "@core/api/types";
import { defineModule } from "@merkl/conduit";
import type { api } from "../../api";
import { type ApiQuery, type ApiResponse, fetchResource } from "../../api/utils";

// type Payload = Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"];
export type Payload = Awaited<ReturnType<typeof api.v3.payload.get>>["data"];

export const PayloadService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Payload")(call);

  const get = inject(["api"]).inFunction(({ api }, query: ApiQuery<Api["v3"]["payload"]["get"]>) => {
    return fetchApi(async () =>
      api.v3.payload.get({
        query: Object.assign({ ...query }),
      }),
    );
  });

  return {
    get,
  };
});
