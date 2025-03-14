import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";

export const ReferralService = defineModule<{ api: Api }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Referral")(call);

  const getCodeOrTransaction = inject(["api"]).inFunction(
    ({ api }, chainId: number, referralKey: string, address: string) => {
      return fetchApi(() => api.v4.referral.code.get({ query: { chainId, referralKey, address } }));
    },
  );

  const getReferralTransaction = inject(["api"]).inFunction(
    ({ api }, chainId: number, referralKey: string, address: string) => {
      return fetchApi(() => api.v4.referral.code.get({ query: { chainId, referralKey, address } }));
    },
  );

  return {
    getCodeOrTransaction,
    getReferralTransaction,
  };
});
