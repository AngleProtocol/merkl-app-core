import { zksync } from "viem/zksync";

export type ZyfiApi = {
  "erc20_sponsored_paymaster/v1": {
    payload: {
      /**
       * Defaults to ZKsync Era
       */
      chainId?: number;
      feeTokenAddress?: string;
      /**
       * [0-100] how much of the tx to sponsor
       */
      sponsorshipRatio: number;
      /**
       * Defaults to 5, how many time can the user replay the tx
       */
      replayLimit?: string;
      txData: {
        from: string;
        to: string;
        data: string;
      };
    };
    response: {
      expirationTime: string;
      expiresIn: string;
      feeTokenAmount: string;
      feeTokendecimals: string;
      feeUSD: string;
      gasLimit: string;
      gasPrice: string;
      markup: string;
      maxNonce: string;
      protocolAddress: string;
      sponsorshipRatio: string;
      tokenAddress: string;
      tokenPrice: string;
      txData: {
        from: string;
        to: string;
        data: string;
      };
      warnings: string[];
    };
  };
};

export abstract class ZyfiService {
  static async #fetch<R, T extends { data: R; status: number }>(
    call: () => Promise<T>,
    resource = "Opportunity",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await call();

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async #post<R extends keyof ZyfiApi>(
    route: R,
    payload: ZyfiApi[R]["payload"],
  ): Promise<ZyfiApi[R]["response"]> {
    const response = await fetch(`https://api.zyfi.org/api/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.ZYFI_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
    });

    return (await response.json()) as ZyfiApi[R]["response"];
  }

  /**
   * Get sponsored tx from raw payload
   * @param transaction to wrap
   * @returns query
   */
  static async wrapTx(transaction: ZyfiApi["erc20_sponsored_paymaster/v1"]["payload"]["txData"]) {
    const res = await ZyfiService.#post("erc20_sponsored_paymaster/v1", {
      txData: transaction,
      sponsorshipRatio: 100,
    });

    return res;
  }

  static async wrapAndPrepareTx({
    data,
    from,
    to,
    value,
  }: ZyfiApi["erc20_sponsored_paymaster/v1"]["payload"]["txData"]) {
    const check = await ZyfiService.wrapTx({
      data,
      from,
      to,
      value,
    });

    if (!check.txData) return null;

    return {
      account: from,
      to: check.txData?.to,
      value: BigInt(check.txData.value!),
      chain: zksync,
      gas: BigInt(check.txData.gasLimit),
      gasPerPubdata: BigInt(check.txData.customData.gasPerPubdata),
      maxFeePerGas: BigInt(check.txData.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(0),
      data: check.txData.data,
      paymaster: check.txData.customData.paymasterParams.paymaster,
      paymasterInput: check.txData.customData.paymasterParams.paymasterInput,
    };
  }
}
