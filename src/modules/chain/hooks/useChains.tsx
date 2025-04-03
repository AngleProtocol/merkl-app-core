import { useMerklConfig } from "@core/modules/config/config.context";
import type { Chain } from "@merkl/api";
import { Icon, Text } from "dappkit";
import { useWalletContext } from "dappkit";
import { type ReactNode, useMemo } from "react";

/**
 * Utilities for displaying data & components related to chains
 * @param chainsData array from api
 */
export default function useChains(chainsData?: Chain[]) {
  const { chainId } = useWalletContext();
  const chainsConfig = useMerklConfig(store => store.config.chains);

  /**
   * Filtered Options
   * @description filters on enabled chains from the config & api
   */
  const chains = useMemo(
    () =>
      chainsData
        ?.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        ?.filter(({ id }) => {
          if (id === 1337) return false;
          return !chainsConfig?.length || chainsConfig?.some(enabledChains => enabledChains.id === id);
        }) ?? [],
    [chainsData, chainsConfig],
  );

  /**
   * Selector Options
   * @description filters on enabled chains from the config & api
   */
  const options: { [id: number]: ReactNode } = useMemo(
    () =>
      chains
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .reduce(
          (obj, chain) =>
            Object.assign(obj, {
              [chain.id]: (
                <>
                  <Icon size="sm" src={chain?.icon} />
                  <Text look="bold">{chain.name}</Text>
                </>
              ),
            }),
          {},
        ) ?? [],
    [chains],
  );

  /**
   * Selector Options
   * @description filters on enabled chains from the config & api
   */
  const searchOptions: { [id: number]: ReactNode } = useMemo(
    () =>
      chains
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .reduce(
          (obj, chain) =>
            Object.assign(obj, {
              [chain.id]: chain.name,
            }),
          {},
        ) ?? [],
    [chains],
  );

  const indexOptions: { [id: number]: number } = useMemo(
    () =>
      chains
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .reduce(
          (obj, chain, index) =>
            Object.assign(obj, {
              [chain.id]: index,
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
    searchOptions,
    indexOptions,
  };
}
