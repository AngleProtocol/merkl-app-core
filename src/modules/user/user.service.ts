import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import { defineModule } from "@merkl/conduit";
import { isAddressEqual } from "viem";

/**
 * @description This service provides user-related functionalities.
 */
export const UserService = defineModule<{ api: Api }>().create(({ inject }) => {
  /**
   * @description A helper function to fetch data from the API.
   * @param call The API call to execute.
   * @returns A promise that resolves to the API response.
   */
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("User")(call);

  /**
   * @description Checks if two addresses are the same.
   * @param a The first address.
   * @param b The second address.
   * @returns True if the addresses are the same, false otherwise.
   */
  const isSame = (a?: string, b?: string) => {
    if (a?.startsWith("0x") && b?.startsWith("0x")) return isAddressEqual(a as `0x${string}`, b as `0x${string}`);
    return false;
  };

  /**
   * @description Checks if an address is blacklisted.
   * @param address The address to check.
   * @returns A promise that resolves to true if the address is blacklisted, false otherwise.
   */
  const isBlacklisted = inject(["api"]).inFunction(({ api }, address: string) => {
    return fetchApi(() => api.v4.blacklists.check({ address }).get({ query: {} }));
  });

  return {
    isSame,
    isBlacklisted,
  };
});
