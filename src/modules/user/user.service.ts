import { api } from "@core/api";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import type { Creator } from "@merkl/api";
import { isAddress, isAddressEqual } from "viem";

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

  /**
   * Gets either the creator from its id (i.e. "uniswap") or by its address
   * @param creatorIdOrAddress
   * @returns an object with either creator or address defined
   */
  static async getCreatorOrAddress(
    creatorIdOrAddress: string,
  ): Promise<{ creator: Creator; address: undefined } | { creator: undefined; address: string }> {
    try {
      const creator = await UserService.getCreator(creatorIdOrAddress!);
      return { creator, address: undefined };
    } catch (err) {
      const address = isAddress(creatorIdOrAddress);

      if (!address) throw err;
      return { creator: undefined, address: creatorIdOrAddress };
    }
  }
}
