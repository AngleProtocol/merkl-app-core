import type { Api } from "@core/api/types";
import { defineModule } from "@merkl/conduit";
import { type ApiResponse, fetchResource } from "../../api/utils";

export const LiquidityService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Interaction")(call);

  const getForUser = inject(["api"]).inFunction(
    ({ api }, query: Parameters<Api["v4"]["liquidity"]["index"]["get"]>["0"]["query"]) => {
      return fetchApi(() => api.v4.liquidity.index.get({ query }));
    },
  );

  return {
    getForUser,
  };
});
