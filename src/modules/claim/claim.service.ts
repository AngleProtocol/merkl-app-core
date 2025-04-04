import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";

export const ClaimsService = defineModule<{ api: Api; request: Request; backend: MerklBackendConfig }>().create(
  ({ inject }) => {
    const fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Claims")(call);

    const getForUser = inject(["api", "backend"]).inFunction(async ({ api, backend }, address: string) => {
      const chainIds = backend.chains?.map(({ id }) => id).join(",");
      const query: Record<string, string> = {};
      if (chainIds) query.chainIds = chainIds;
      return fetch(async () => api.v4.claims({ address }).get({ query }));
    });

    const getForUserFromRequest = inject(["api", "request", "backend"]).inFunction(
      ({ api, request, backend }, address: string) => {
        const url = new URL(request.url);
        const chainIdsParams = url.searchParams.get("chain") ?? undefined;

        const chainIds =
          (backend.chains?.length
            ? backend.chains
                ?.map(({ id }) => id)
                ?.filter(id => chainIdsParams === undefined || chainIdsParams.split(",").includes(id.toString()))
                .join(",")
            : undefined) ?? chainIdsParams;
        const query: Record<string, string> = {};

        if (chainIds) query.chainIds = chainIds;
        return fetch(async () => api.v4.claims({ address }).get({ query }));
      },
    );

    return {
      getForUser,
      getForUserFromRequest,
    };
  },
);
