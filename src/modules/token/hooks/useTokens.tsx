import type { Token } from "@merkl/api";
import { useCallback } from "react";

/**
 * Provide basic methods for a given Token
 */
export default function useTokens(token: Token) {
  /**
   * Navigate to coingecko page for a given token
   */
  const navigateToCoinGecko = useCallback(() => {
    window.open(`https://www.coingecko.com/en/coins/${token?.address}`, "_blank");
  }, [token?.address]);

  return {
    navigateToCoinGecko,
  };
}
