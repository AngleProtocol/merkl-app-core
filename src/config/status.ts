import type { Opportunity } from "@merkl/api";
import type { IconProps } from "dappkit";

export const statuses = {
  LIVE: {
    label: "Live",
    description: "Opportunity on which campaigns are distributing",
    icon: {
      remix: "RiFlashlightFill",
      className: "text-accent-11",
      accent: "good",
    },
  },
  PAST: {
    label: "Past",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiTimerFill", className: "text-accent-9", accent: "harm" },
  },
  SOON: {
    label: "Upcoming",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: {
      remix: "RiTimer2Fill",
      className: "text-accent-9",
      accent: "warn",
    },
  },
  NONE: {
    label: "None",
    description: "Earn rewards by depositiong liquidity in this pool.",
    icon: { remix: "RiTimerLine", className: "text-accent-11", accent: "good" },
  },
} satisfies {
  [S in Opportunity["status"]]: {
    label: string;
    icon: IconProps;
    description: string;
  };
};

export type Status = keyof typeof statuses;

export function getStatus(labelOrKey: string): Status | undefined {
  for (const [status, { label }] of Object.entries(statuses)) {
    if (label?.toLowerCase() === labelOrKey?.toLowerCase() || status?.toLocaleLowerCase() === labelOrKey?.toLowerCase())
      return status as Status;
  }
}
