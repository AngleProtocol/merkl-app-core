import { lazy } from "react";


export const LifiConfig: any = {
  variant: "wide",
  subvariant: "default",
  appearance: "dark",
  theme: {
    palette: {
      primary: {
        main: "#ff9954",
      },
      secondary: {
        main: "#85b1ff",
      },
      background: {
        default: "#0d2252",
        paper: "#071534",
      },
      text: {
        primary: "#dfefff",
        secondary: "#85b1ff",
      },
      grey: {
        200: "#d6eaff",
        300: "#85b1ff",
        700: "#2f6cff",
        800: "#0746ec",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
    container: {
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
      borderRadius: "16px",
    },
    shape: {
      borderRadius: 8,
      borderRadiusSecondary: 60,
    },
  },
  fromChain: 1,
  toChain: 324,
  fromToken: "0x0000000000000000000000000000000000000000", // Native token
  toToken: "0x0000000000000000000000000000000000000000", // Native token
  poweredBy: "jumper",
};

const LiFiWidgetLazy = lazy(async () => {
  return { default: () => null };
});

export function LiFiWidget() {
  return null;
}
