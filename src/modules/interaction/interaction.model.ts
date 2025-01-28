import type { api } from "../../api";

export type TransactionPayload = {
  claim: {
    args: (string[] | `0x${string}`[][])[];
    userAddress: string;
    distributor: string;
  };
  supply: Parameters<typeof api.v4.interaction.transaction.get>[0]["query"];
};
export type TransactionName = keyof TransactionPayload;
