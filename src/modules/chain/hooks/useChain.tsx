import { useWalletContext } from "dappkit";
import { useMemo } from "react";

/**
 * Returns corresponding chain from context for richer chain data
 */
export default function useChain(chainId?: { id: number }) {
  const { chains } = useWalletContext();

  /**
   * Chain found from the local chain cache
   */
  const chain = useMemo(() => {
    if (!chainId) return undefined;
    return chains.find(({ id }) => id === chainId.id)!;
  }, [chainId, chains]);

  /**
   * Internal link to the chain's page
   */
  const link = useMemo(() => {
    if (!chain) return "";
    return `/chains/${chain.name.replace(" ", "-").toLowerCase()}`;
  }, [chain]);

  return {
    chain: chain || undefined,
    link,
  };
}
