import type { Chain } from "@merkl/api";
import { Icon } from "dappkit";
import { useWalletContext } from "dappkit";
import { type ReactNode, useMemo } from "react";
import merklConfig from "../../config";

/**
 * Utilities for displaying data & components related to chains
 * @param chainsData array from api
 */
export default function useChains(chainsData?: Chain[]) {
  const { chainId } = useWalletContext();

  /**
   * Filtered Options
   * @description filters on enabled chains from the config & api
   */
  const chains = useMemo(
    () =>
      chainsData?.filter(({ id }) => {
        if (id === 1337) return false;
        return !merklConfig.chains?.length || merklConfig.chains.some(enabledChains => enabledChains.id === id);
      }) ?? [],
    [chainsData],
  );

  /**
   * Selector Options
   * @description filters on enabled chains from the config & api
   */
  const options: { [id: number]: ReactNode } = useMemo(
    () =>
      chains.reduce(
        (obj, chain) =>
          Object.assign(obj, {
            [chain.id]: (
              <>
                <Icon size="sm" src={chain?.icon} />
                {chain.name}
              </>
            ),
          }),
        {},
      ) ?? [],
    [chains],
  );

  /**
   * True if the app only allows one network
   */
  const isSingleChain = chains.length === 1;

  /**
   * Single chain for the app if the app only allows one network
   */
  const singleChain = isSingleChain ? chains?.[0] : undefined;

  /**
   * True if the app only allows one network and the user is connected to it
   */
  const isOnSingleChain = useMemo(
    () => isSingleChain && chainId === singleChain?.id,
    [isSingleChain, chainId, singleChain],
  );

  return {
    singleChain,
    isSingleChain,
    isOnSingleChain,
    chains,
    options,
  };
}
