import type { Api } from "@core/api/types";
import { type ApiResponse, fetchResource } from "@core/api/utils";
import type { Opportunity } from "@merkl/api";
import { defineModule } from "@merkl/conduit";
import type { MerklBackendConfig } from "../config/types/merklBackendConfig";
import type { TransactionName, TransactionPayload } from "./interaction.model";

export const InteractionService = defineModule<{ api: Api; backend: MerklBackendConfig }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Interaction")(call);

  const get = async <Tx extends TransactionName>(
    //TODO: template type the transaction
    name: Tx,
    payload: TransactionPayload[Tx],
    options?: { sponsor?: boolean },
  ) => {
    const response = await fetch(`/transaction/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload, ...options }),
    });

    //TODO: use template type to get correct response type
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return (await response.json()) as any;
  };

  const getTargets = inject(["api"]).inFunction(({ api }, chainId: number, protocolId: string, identifier: string) => {
    return fetchApi(() =>
      api.v4.interaction.targets.get({
        query: { chainId, protocolId, identifier },
      }),
    );
  });

  const getBalances = inject(["api"]).inFunction(async ({ api }, chainId: number, address: string) => {
    return fetchApi(() =>
      api.v4.tokens.balances.get({
        query: { chainId: chainId, userAddress: address },
      }),
    );
  });

  const getTargetsByOpportunity = inject(["api", "backend"]).inFunction(
    async ({ api, backend }, opportunity: Pick<Opportunity, "protocol" | "chainId" | "identifier"> | undefined) => {
      if (!opportunity || !opportunity.protocol || !backend.deposit) return undefined;
      const targets = await getTargets.handler(
        { api },
        opportunity.chainId,
        opportunity?.protocol?.id,
        opportunity?.identifier,
      );

      if (targets && targets.length === 0) return;
      return targets;
    },
  );

  return {
    get,
    getTargets,
    getBalances,
    getTargetsByOpportunity,
  };
});
