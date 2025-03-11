import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import merklConfig from "@core/config";
import { defineModule } from "@merkl/conduit";

export const ClaimsService = defineModule<{ api: Api; request: Request }>().create(({ inject }) => {
  const fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Claims")(call);

  const getForUser = inject(["api"]).inFunction(async ({ api }, address: string) => {
    const chainIds = merklConfig.chains?.map(({ id }) => id).join(",");
    const query: Record<string, string> = {};
    if (chainIds) query.chainIds = chainIds;
    return fetch(async () => api.v4.claims({ address }).get({ query }));
  });

  const getForUserFromRequest = inject(["api", "request"]).inFunction(({ api, request }, address: string) => {
    const url = new URL(request.url);
    const chainIdsParams = url.searchParams.get("chain") ?? undefined;

    const chainIds =
      (merklConfig.chains?.length
        ? merklConfig.chains
            ?.map(({ id }) => id)
            ?.filter(id => chainIdsParams === undefined || chainIdsParams.split(",").includes(id.toString()))
            .join(",")
        : undefined) ?? chainIdsParams;
    const query: Record<string, string> = {};

    if (chainIds) query.chainIds = chainIds;
    return fetch(async () => api.v4.claims({ address }).get({ query }));
  });

  return {
    getForUser,
    getForUserFromRequest,
  };
});
