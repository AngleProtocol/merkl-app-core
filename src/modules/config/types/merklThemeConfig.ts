import type { sizeScale, Themes } from "dappkit";

/**
 * Configuration for dappkit
 * @description color themes, spacing, theme
 */
export type MerklThemeConfig<T extends Themes = Themes> = {
  modes: ("dark" | "light")[];
  defaultTheme: keyof T;
  themes: T;
  /**
   * Sizing theme, influences the padding, gaps & radius.
   */
  sizing: {
    width: { [Size in (typeof sizeScale)[number]]: number };
    spacing: { [Size in (typeof sizeScale)[number]]: number };
    radius: { [Size in (typeof sizeScale)[number]]: number };
  };
};
