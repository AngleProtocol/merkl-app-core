import type { Chain } from "viem";

export interface MerklBackendConfig {
  appName: string;
  tags?: string[];
  chains?: Pick<Chain, "id">[];
  alwaysShowTestTokens?: boolean;
  alwaysShowPointTokens?: boolean;
  showDevelopmentHelpers?: boolean;
  sortedBy: "apr" | "rewards";
  opportunityDefaultStatus: Array<"LIVE" | "SOON" | "PAST">;
  featured?: {
    enabled: boolean;
    length: number;
  };
  leaderboard?: {
    chain: string;
    address: string;
  };
  rewardsTotalClaimableMode?: string;
  tokenSymbolPriority?: string[];
  deposit: boolean;
}
