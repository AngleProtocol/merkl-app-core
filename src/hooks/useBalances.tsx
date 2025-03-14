import { api } from "@core/api";
import type { Api } from "@core/api/types";
import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { InteractionService } from "../modules/interaction/interaction.service";

type TokenBalances = Awaited<ReturnType<Api["v4"]["tokens"]["balances"]["get"]>>["data"];
type BalanceStore = {
  balance: { [chainId: number]: { [address: string]: TokenBalances } };
  update: (chainId: number, address: string, balances: TokenBalances) => void;
  balanceOf: (
    chainId: number,
    address: string,
    token: { address?: string; symbol?: string },
  ) => NonNullable<TokenBalances>[number] | undefined;
  balances: (chainId: number, address: string) => TokenBalances | undefined;
};

const useBalanceStore = create<BalanceStore>((set, get) => ({
  balance: {},
  balances(chainId, address) {
    if (!chainId || !address) return;
    return get()?.balance?.[chainId]?.[address];
  },
  balanceOf: (chainId: number, address: string, token: { address?: string; symbol?: string }) =>
    get().balance?.[chainId]?.[address]?.find(({ address, symbol }) => {
      if (token.address && address?.toLowerCase?.() === token?.address?.toLowerCase?.()) return true;
      if (token.symbol && symbol?.toLowerCase?.() === token?.symbol?.toLowerCase?.()) return true;
    }),
  update: (chainId: number, address: string, balances: TokenBalances) => {
    set(state => ({ balance: { ...state.balance, [chainId]: { [address]: balances } } }));
  },
}));

export default function useBalances(chainId?: number, userAddress?: string) {
  const { chainId: connectedChainId, address: connectedAddress } = useWalletContext();

  const address = useMemo(() => userAddress ?? connectedAddress, [userAddress, connectedAddress]);
  const chain = useMemo(() => chainId ?? connectedChainId, [chainId, connectedChainId]);
  const { update } = useBalanceStore();
  const balance = useBalanceStore(state => state?.balance);
  const [loading, setLoading] = useState(false);

  const balances = useMemo(() => {
    if (!chain || !address || !balance || typeof balance !== "object") return;
    const userBalance = balance[chain]?.[address];
    return userBalance;
  }, [chain, address, balance]);

  const reload = useCallback(async () => {
    if (!chain || !address) return;

    setLoading(true);
    try {
      const tokens = await InteractionService({ api }).getBalances(chain, address);

      update(chain, address, tokens);
    } catch {}
    setLoading(false);
  }, [chain, address, update]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { balances, loading, reload };
}
