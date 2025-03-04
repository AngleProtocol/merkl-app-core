import { useWalletContext } from "dappkit";
import { useMemo } from "react";
import useBalances from "./useBalances";
import useInteractionTargets from "./useInteractionTarget";
import merklConfig from "@core/config";

export default function useParticipate(
  chainId: number,
  protocolId?: string,
  identifier?: string,
  tokenAddress?: string,
) {
  if (!merklConfig.deposit) return { balance: [], targets: [], address: "", loading: false, token: undefined };

  const { targets, loading: targetLoading } = useInteractionTargets(chainId, protocolId, identifier);
  const { balances, loading: balanceLoading } = useBalances(chainId);

  const { address } = useWalletContext();

  const token = useMemo(() => {
    return balances?.find(({ address }) => address === tokenAddress);
  }, [tokenAddress, balances]);

  const loading = useMemo(() => targetLoading || balanceLoading, [targetLoading, balanceLoading]);

  return {
    balance: balances,
    targets,
    address,
    loading,
    token,
  };
}
