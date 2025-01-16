import { api as clientApi } from "../../api";
import { fetchWithLogs } from "../../api/utils";
import { ZyfiService } from "../zyfi/zyfi.service";
import type { TransactionName, TransactionPayload } from "../interaction/interaction.model";

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

  /**
   * Client side
   */
  static async getTransaction(
    payload: Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"],
    sponsor?: boolean,
  ) {
    const transaction = await InteractionService.#fetch(() =>
      clientApi.v4.interaction.transaction.get({
        query: payload,
      }),
    );

    if (sponsor && !transaction.approved) {
      transaction.approval = await ZyfiService.wrapAndPrepareTx({ ...transaction.approval, from: payload.userAddress });
    } else if (sponsor) {
      transaction.transaction = await ZyfiService.wrapAndPrepareTx({
        ...transaction.transaction,
        from: payload.userAddress,
      });
    }

    return transaction;
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
