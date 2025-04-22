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
    cta: "Supply",
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
    cta: "Borrow",
  },
  LEND: {
    label: "Lend",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiShoppingBagFill" },
    cta: "Lend",
  },
  HOLD: {
    label: "Hold",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiCoinFill" },
    cta: "Hold",
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
  return Object.entries(actions).find(
    ([action, data]) =>
      data.label?.toLowerCase() === labelOrKey?.toLowerCase() ||
      action?.toLocaleLowerCase() === labelOrKey?.toLowerCase(),
  )?.[1];
}

export function getAction(labelOrKey: string): Action | undefined {
  return Object.entries(actions).find(
    ([action, data]) =>
      data.label?.toLowerCase() === labelOrKey?.toLowerCase() ||
      action?.toLocaleLowerCase() === labelOrKey?.toLowerCase(),
  )?.[0] as Action;
}
