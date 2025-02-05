import type { api } from "../../api";

export type TransactionPayload = {
  reallocate: {
    userAddress: string;
    distributionCreator: string;
    from: string[];
    to: string;
    campaignId: string;
  };
  claim: {
    args: (string[] | `0x${string}`[][])[];
    userAddress: string;
    distributor: string;
  };
  supply: Parameters<typeof api.v4.interaction.transaction.get>[0]["query"];
};
export type TransactionName = keyof TransactionPayload;
