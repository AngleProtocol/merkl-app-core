import type { api } from "@core/api";
import { useWalletContext } from "packages/dappkit/src";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TransactionName, TransactionPayload } from "../interaction.model";
import { InteractionService } from "../interaction.service";

type Transaction = Awaited<ReturnType<typeof api.v4.interaction.transaction.get>>["data"];

export default function useIndexedTransaction<Tx extends TransactionName>(
  chainId: number,
  name: Tx,
  payload: TransactionPayload[Tx] | undefined,
) {
  const { sponsorTransactions } = useWalletContext();

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Mapping of payload to transaction for caching purposes
   */
  const [transactions, setTransactions] = useState<{ [payload: string]: Transaction }>();

  /**
   * Function to re-fetch the transaction (/transaction/:name)
   */
  const reload = useCallback(
    async function fetchTransaction() {
      if (!payload) return;

      setLoading(true);
      try {
        const tx = await InteractionService.get(name, payload, { sponsor: sponsorTransactions && chainId === 324 });
        console.log("tx res", tx);

        setTransactions(txns => {
          return { ...txns, [JSON.stringify(payload)]: tx };
        });
      } catch {}
      setLoading(false);
    },
    [payload, sponsorTransactions, name, chainId],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const transaction = useMemo(() => {
    if (!payload) return;
    return transactions?.[JSON.stringify(payload)];
  }, [transactions, payload]);

  return { loading, transaction, transactions, reload };
}
