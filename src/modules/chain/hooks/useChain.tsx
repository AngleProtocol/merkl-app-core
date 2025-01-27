import { useWalletContext } from "dappkit";
import { useMemo } from "react";

/**
 * Returns corresponding chain from context for richer chain data
 */
export default function useChain(chain?: { id: number }) {
  const { chains } = useWalletContext();

  return {
    chain: useMemo(() => {
      if (!chain) return;
      return chains.find(({ id }) => id === chain.id)!;
    }, [chain, chains]),
  };
}
