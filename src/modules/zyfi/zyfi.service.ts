import type { Api } from "@core/api/types";
import { defineModule } from "@merkl/conduit";
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
        value?: number | bigint;
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
        gasLimit: string;
        maxFeePerGas: string;
        value?: number | bigint;
        customData: {
          gasPerPubdata: string;
          paymasterParams: {
            paymaster: string;
            paymasterInput: string;
          };
        };
      };
      warnings: string[];
    };
  };
};

export const ZyfiService = defineModule<{ api: Api }>().create(() => {
  const postApi = async <R extends keyof ZyfiApi>(
    route: R,
    payload: ZyfiApi[R]["payload"],
  ): Promise<ZyfiApi[R]["response"]> => {
    const response = await fetch(`https://api.zyfi.org/api/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.ZYFI_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
    });

    return (await response.json()) as ZyfiApi[R]["response"];
  };

  const wrapTx = async (transaction: ZyfiApi["erc20_sponsored_paymaster/v1"]["payload"]["txData"]) => {
    const res = await postApi("erc20_sponsored_paymaster/v1", {
      txData: transaction,
      sponsorshipRatio: 100,
    });

    return res;
  };

  const wrapAndPrepareTx = async ({
    data,
    from,
    to,
    value,
  }: ZyfiApi["erc20_sponsored_paymaster/v1"]["payload"]["txData"]) => {
    const check = await wrapTx({
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
  };

  return {
    postApi,
    wrapTx,
    wrapAndPrepareTx,
  };
});
