import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";

export const ChainService = defineModule<{ api: Api; request: Request; backend: MerklBackendConfig }>().create(
  ({ inject }) => {
    const fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Chain")(call);

    const getAll = inject(["api", "backend"]).inFunction(({ api, backend }) => {
      const testParam: Record<string, boolean> = {};
      if (backend.alwaysShowTestTokens === true) testParam.test = true;
      return fetch(() => api.v4.chains.index.get({ query: testParam }));
    });

    const getMany = inject(["api", "backend"]).inFunction(
      ({ api, backend }, query: Parameters<Api["v4"]["chains"]["index"]["get"]>[0]["query"]) => {
        const testParam: Record<string, boolean> = {};
        if (backend.alwaysShowTestTokens === true) testParam.test = true;
        return fetch(async () => api.v4.chains.index.get({ query: { ...query, ...testParam } }));
      },
    );

    const get = inject(["api"]).inFunction(
      async ({ api }, query: Parameters<Api["v4"]["chains"]["index"]["get"]>[0]["query"]) => {
        const chains = await fetch(async () =>
          api.v4.chains.index.get({
            query: {
              name: query.name?.replace("-", " "),
            },
          }),
        );

        if (chains.length === 0) throw new Response("Chain not found", { status: 404 });

        //TODO: add some cache here
        return chains?.[0];
      },
    );

    const getById = inject(["api"]).inFunction(async ({ api }, chainId: number) => {
      return fetch(() => api.v4.chains({ chainId }).get());
    });

    return {
      getAll,
      get,
      getMany,
      getById,
    };
  },
);
