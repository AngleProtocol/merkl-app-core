import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { isAddressEqual } from "viem";

export abstract class UserService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("User")(call);

  /**
   * Compares addresses to check if they are equal
   * @notice needed because addresse can be checksum or not
   * @param a address
   * @param b address
   */
  static isSame(a?: string, b?: string): boolean {
    if (a?.startsWith("0x") && b?.startsWith("0x")) return isAddressEqual(a as `0x${string}`, b as `0x${string}`);
    return false;
  }

  /**
   * Whether user is blacklisted or not
   * @param address
   * @returns
   */
  static isBlacklisted(address: string): Promise<boolean> {
    return UserService.#fetch(() => api.v4.blacklists.check({ address }).get({ query: {} }));
  }
}
