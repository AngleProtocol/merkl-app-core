import type { MerklConfig } from "@core/config/type";
import type { Themes } from "dappkit";
import { type PropsWithChildren, createContext, useContext, useState } from "react";
import { create } from "zustand";

export interface ConfigContextStore {
  config: MerklConfig<Themes>;
}
export const initConfigProvider = (config: MerklConfig<Themes>) =>
  create<ConfigContextStore>(() => ({
    config,
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

export function ConfigProvider({ config, children }: PropsWithChildren<ConfigContextStore>) {
  const [useStore] = useState<ReturnType<typeof initConfigProvider>>(() => initConfigProvider(config));

  return <ConfigContext.Provider value={{ useStore }}>{children}</ConfigContext.Provider>;
}
