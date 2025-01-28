import { isAddressEqual } from "viem";

export abstract class UserService {
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
}
