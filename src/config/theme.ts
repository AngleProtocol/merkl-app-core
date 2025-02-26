import type { Themes } from "dappkit";
import type { MerklConfig } from "./type";

export const merklTheme = <T extends Themes>(config: MerklConfig<T>["theme"]) =>
  config as unknown as MerklConfig<Themes>["theme"];
