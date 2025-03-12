import type { Api } from "@core/api/types";
import { defineModule } from "@merkl/conduit";
import { type ApiQuery, type ApiResponse, fetchResource } from "../../api/utils";

export type MorphoPayload = Awaited<ReturnType<Api["v3"]["morphoMarkets"]["get"]>>["data"];

export const MorphoService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Morpho")(call);

  const getMarkets = inject(["api"]).inFunction(({ api }, query: ApiQuery<Api["v3"]["morphoMarkets"]["get"]>) => {
    return fetchApi(async () =>
      api.v3.morphoMarkets.get({
        query: Object.assign({ ...query }),
      }),
    );
  });

  const getVaults = inject(["api"]).inFunction(({ api }, query: ApiQuery<Api["v3"]["morphoMarkets"]["get"]>) => {
    return fetchApi(async () =>
      api.v3.morphoVaults.get({
        query: Object.assign({ ...query }),
      }),
    );
  });

  return {
    getMarkets,
    getVaults,
  };
});
