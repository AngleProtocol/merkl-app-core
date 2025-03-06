import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";

export abstract class ReferralService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Referral")(call);

  static async getCodeOrTransaction(chainId: number, referralKey: string, address: string) {
    return ReferralService.#fetch(() => api.v4.referral.code.get({ query: { chainId, referralKey, address } }));
  }

  static async getReferralTransaction(chainId: number, referralKey: string, code: string) {
    return ReferralService.#fetch(() => api.v4.referral.redeem.get({ query: { chainId, referralKey, code } }));
  }
}
