import type { Opportunity } from "@merkl/api";
import type { IconProps } from "dappkit";

export const actions = {
  INVALID: {
    label: "Invalid",
    description: "Invalid",
    icon: { remix: "RiFileWarningLine" },
  },
  POOL: {
    label: "Provide Liquidity",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiWaterFlashFill" },
  },
  DROP: {
    label: "Airdrop",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiWindyFill" },
  },
  BORROW: {
    label: "Borrow",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiTokenSwapLine" },
  },
  LEND: {
    label: "Lend",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiShoppingBagFill" },
  },
  HOLD: {
    label: "Hold",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiCoinFill" },
  },
  LONG: {
    label: "Long",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiCoinFill" },
  },
  SHORT: {
    label: "Short",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiCoinFill" },
  },
} satisfies { [S in Opportunity["action"]]: { label: string; icon: IconProps; description: string } };

export type Action = keyof typeof actions;

export function getAction(labelOrKey: string): Action | undefined {
  for (const [action, { label }] of Object.entries(actions)) {
    if (label?.toLowerCase() === labelOrKey?.toLowerCase() || action?.toLocaleLowerCase() === labelOrKey?.toLowerCase())
      return action as Action;
  }
}
