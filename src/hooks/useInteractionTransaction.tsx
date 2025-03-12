import type { Token } from "@merkl/api";
//TODO: export from api index
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type api as clientApi } from "../api/index";
import { InteractionService } from "../modules/interaction/interaction.service";

type Payload = Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"];
type Transaction = Awaited<ReturnType<typeof clientApi.v4.interaction.transaction.get>>["data"];

export default function useInteractionTransaction(
  chainId: number,
  protocolId?: string,
  target?: InteractionTarget,
  tokenIn?: Token,
  amount?: bigint,
  userAddress?: string,
  slippage?: bigint,
) {
  const { address: connectedAddress, sponsorTransactions } = useWalletContext();
  const address = useMemo(() => userAddress ?? connectedAddress, [userAddress, connectedAddress]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [transactions, setTransactions] = useState<{ [payload: string]: Transaction }>();
  const payload: Payload | undefined = useMemo(() => {
    if (!chainId || !protocolId || !address || !amount || !tokenIn || !target?.identifier) return;
    return {
      chainId,
      protocolId,
      identifier: target?.identifier,
      userAddress: address,
      slippage: slippage ? Number.parseInt(slippage.toString()) : undefined,
      fromAmount: amount?.toString(),
      fromTokenAddress: tokenIn?.address,
    };
  }, [chainId, protocolId, target, address, tokenIn, slippage, amount]);

  const transaction = useMemo(() => {
    if (!payload) return;
    return transactions?.[JSON.stringify(payload)];
  }, [transactions, payload]);

  const reload = useCallback(
    async function fetchTransaction() {
      if (!payload) return;

      setLoading(true);
      setError(false);
      try {
        const tx = await InteractionService({ api }).get("supply", payload, {
          sponsor: sponsorTransactions && chainId === 324,
        });

        setTransactions(txns => {
          return { ...txns, [JSON.stringify(payload)]: tx };
        });
      } catch {
        setError(true);
      }
      setLoading(false);
    },
    [payload, sponsorTransactions, chainId],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { transaction, reload, loading, error };
}
