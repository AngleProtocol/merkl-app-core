import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionService } from "../modules/interaction/interaction.service";
import type { api as clientApi } from "./../api";

type Transaction = Awaited<ReturnType<typeof clientApi.v4.interaction.transaction.get>>["data"];

export default function useTransaction(chainId: number, payload: any, txFunctionName: "deposit" | "approve") {
  const { sponsorTransactions } = useWalletContext();

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<{ [payload: string]: Transaction }>();

  const transaction = useMemo(() => {
    if (!payload) return;
    return transactions?.[JSON.stringify(payload)];
  }, [transactions, payload]);

  const reload = useCallback(
    async function fetchTransaction() {
      if (!payload) return;
      setLoading(true);
      try {
        const tx = await InteractionService.get(txFunctionName, payload, {
          sponsor: sponsorTransactions && chainId === 324,
        });
        setTransactions(txns => {
          return { ...txns, [JSON.stringify(payload)]: tx };
        });
      } catch (e) {
        console.log("ERRROR >", { e });
      }
      setLoading(false);
    },
    [payload, sponsorTransactions, chainId, txFunctionName],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { transaction, reload, loading };
}
