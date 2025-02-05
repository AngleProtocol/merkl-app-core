import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { isAddressEqual } from "viem";

export abstract class UserService {
  static #fetch = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Campaigns")(call);

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
   * Gets the creator data of the users or undefined if they are not
   * @param userAddress
   */
  static async getCreatorOf(address: string) {
    return UserService.#fetch(() => api.v4.users({ address }).creator.get());
  }

  /**
   * Gets the creator with its id
   * @param id (i.e. "uniswap")
   */
  static async getCreator(id: string) {
    return UserService.#fetch(() => api.v4.creators({ id }).get());
  }
}
