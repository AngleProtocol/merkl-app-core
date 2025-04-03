import { useMerklConfig } from "@core/modules/config/config.context";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useWalletContext } from "dappkit";
import { useMemo } from "react";
import useBalances from "./useBalances";
import useInteractionTargets from "./useInteractionTarget";

export default function useParticipate(
  chainId: number,
  protocolId?: string,
  identifier?: string,
  tokenAddress?: string,
  serverTargets?: InteractionTarget[],
) {
  const isDepositEnabled = useMerklConfig(store => store.config.deposit);

  /** @todo avoid doing an early return before hooks, might break the app if the deposit were to change dynamically */
  if (!isDepositEnabled) return { balance: [], targets: [], address: "", loading: false, token: undefined };

  const { targets, loading: targetLoading } = useInteractionTargets(chainId, protocolId, identifier, serverTargets);
  const { balances, loading: balanceLoading } = useBalances(chainId);

  const { address } = useWalletContext();

  const token = useMemo(() => {
    return balances?.find(({ address }) => address === tokenAddress);
  }, [tokenAddress, balances]);

  return {
    balance: balances,
    targets: targets,
    address,
    loading: targetLoading,
    loadingBalances: balanceLoading,
    token,
  };
}
