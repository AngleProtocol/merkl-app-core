import type { Opportunity } from "@merkl/api";
import type { IconProps } from "dappkit";

export const actions = {
  INVALID: {
    label: "Invalid",
    description: "Invalid",
    icon: { remix: "RiFileWarningLine" },
    cta: "Invalid",
  },
  POOL: {
    label: "Provide Liquidity",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiWaterFlashFill" },
    cta: "Supply Liquidity",
  },
  DROP: {
    label: "Airdrop",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiWindyFill" },
    cta: "Participate",
  },
  BORROW: {
    label: "Borrow",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiTokenSwapLine" },
    cta: "Borrow Assets",
  },
  LEND: {
    label: "Lend",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiShoppingBagFill" },
    cta: "Lend Assets",
  },
  HOLD: {
    label: "Hold",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiCoinFill" },
    cta: "Acquire & Hold",
  },
  SWAP: {
    label: "Swap",
    description: "Earn rewards by swapping assets.",
    icon: { remix: "RiArrowLeftRightLine" },
    cta: "Swap",
  },
  LONG: {
    label: "Long",
    description: "Earn rewards by opening longs.",
    icon: { remix: "RiArrowLeftRightLine" },
    cta: "Open Long",
  },
  SHORT: {
    label: "Short",
    description: "Earn rewards by opening shorts.",
    icon: { remix: "RiArrowLeftRightLine" },
    cta: "Open Short",
  },
} satisfies { [S in Opportunity["action"]]: { label: string; icon: IconProps; description: string; cta: string } };

export type Action = keyof typeof actions;

export function getActionData(
  labelOrKey: string,
): { label: string; icon: IconProps; description: string; cta: string } | undefined {
  for (const [action, data] of Object.entries(actions)) {
    if (
      data.label?.toLowerCase() === labelOrKey?.toLowerCase() ||
      action?.toLocaleLowerCase() === labelOrKey?.toLowerCase()
    )
      return data;
  }
}

export function getAction(labelOrKey: string): Action | undefined {
  for (const [action, { label }] of Object.entries(actions)) {
    if (label?.toLowerCase() === labelOrKey?.toLowerCase() || action?.toLocaleLowerCase() === labelOrKey?.toLowerCase())
      return action as Action;
  }
}
