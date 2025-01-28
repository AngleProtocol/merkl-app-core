import { api as clientApi } from "@core/api";
import { fetchWithLogs } from "@core/api/utils";
import type { TransactionName, TransactionPayload } from "./interaction.model";

export abstract class InteractionService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Chain",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async get<Tx extends TransactionName>(
    //TODO: template type the transaction
    name: Tx,
    payload: TransactionPayload[Tx],
    options?: { sponsor?: boolean },
  ) {
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
  }

  /**
   * Client side
   * @param chainId
   * @param protocolId
   * @param identifier
   */
  static async getTargets(chainId: number, protocolId: string, identifier: string) {
    const targets = await InteractionService.#fetch(() =>
      clientApi.v4.interaction.targets.get({
        query: { chainId, protocolId, identifier },
      }),
    );

    //TODO: opportunity/:id/target instead of taking the first result and expecting unique
    return targets;
  }

  static async getBalances(chainId: number, address: string) {
    const tokens = await InteractionService.#fetch(() =>
      clientApi.v4.tokens.balances.get({
        query: { chainId: chainId, userAddress: address },
      }),
    );

    return tokens;
  }
}
