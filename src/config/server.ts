import type { Chain } from "viem";

export interface MerklServer {
  tags?: string[];
  chains?: Chain[];
  alwaysShowTestTokens?: boolean;
  sortedBy: "apr" | "dailyRewards";
  featured?: {
    enabled: boolean;
    length: number;
  };
  rewardsTotalClaimableMode?: string;
  tokenSymbolPriority?: string[];
}

export const merklServer = (create: () => MerklServer) => create();
