import type { Chain } from "viem";

export interface MerklBackend {
  appName: string;
  tags?: string[];
  chains?: Chain[];
  alwaysShowTestTokens?: boolean;
  sortedBy: "apr" | "rewards";
  featured?: {
    enabled: boolean;
    length: number;
  };
  rewardsTotalClaimableMode?: string;
  tokenSymbolPriority?: string[];
}

export const merklBackend = (create: () => MerklBackend) => create();
