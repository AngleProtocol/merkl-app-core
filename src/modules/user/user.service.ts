import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";
import { isAddressEqual } from "viem";

export const UserService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("User")(call);

  const isSame = (a?: string, b?: string) => {
    if (a?.startsWith("0x") && b?.startsWith("0x")) return isAddressEqual(a as `0x${string}`, b as `0x${string}`);
    return false;
  };

  const isBlacklisted = inject(["api"]).inFunction(({ api }, address: string) => {
    return fetchApi(() => api.v4.blacklists.check({ address }).get({ query: {} }));
  });

  const checkTerms = inject(["api"]).inFunction(({ api }, address: string, chainId: number) => {
    return fetchApi(() =>
      api.v4.users({ address }).terms.get({
        query: {
          chainId,
        },
      }),
    );
  });

  return {
    isSame,
    isBlacklisted,
    checkTerms,
  };
});
