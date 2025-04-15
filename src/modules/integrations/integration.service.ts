import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";

export const IntegrationsService = defineModule<{ api: Api; request: Request; backend: MerklBackendConfig }>().create(
  ({ inject }) => {
    const fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Chain")(call);

    const getAll = inject(["api"]).inFunction(({ api }) => {
      return fetch(() => api.v4.tokens.reward.get());
    });

    return {
      getAll,
    };
  },
);
