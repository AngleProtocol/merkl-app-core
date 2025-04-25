import type { Protocol } from "@merkl/api";
import { type PropsWithChildren, createContext, useContext, useState } from "react";
import { create } from "zustand";
import type { MerklConfig } from "./config.model";

export interface ConfigContextStore {
  config: Omit<MerklConfig, "wagmi">;
  protocols: Protocol[];
}
export const initConfigProvider = (config: Omit<MerklConfig, "wagmi">, protocols: Protocol[]) =>
  create<ConfigContextStore>(() => ({
    config,
    protocols,
  }));

export interface ConfigContextData {
  useStore: ReturnType<typeof initConfigProvider>;
}

export const ConfigContext = createContext<ConfigContextData | null>(null);

export function useConfigContext() {
  const data = useContext(ConfigContext);

  if (data === null) throw "useConfigContext should only be used as child of ConfigProvider";
  return data;
}

export function useMerklConfig<
  // biome-ignore lint/suspicious/noExplicitAny: needed ambiguity
  T extends (config: ConfigContextStore) => any,
  R extends T extends (config: ConfigContextStore) => infer P ? P : ConfigContextStore,
>(access: T) {
  const { useStore } = useConfigContext();

  return useStore<R>(access);
}

export function ConfigProvider({ config, children, protocols }: PropsWithChildren<ConfigContextStore>) {
  const [useStore] = useState<ReturnType<typeof initConfigProvider>>(() => initConfigProvider(config, protocols));

  return <ConfigContext.Provider value={{ useStore }}>{children}</ConfigContext.Provider>;
}
