import { api } from "@core/api";
import type { Reward } from "@merkl/api";
import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionService } from "../../modules/interaction/interaction.service";

export default function useReward(reward?: Reward, userAddress?: string, tokenAddresses?: Set<string>) {
  const [claimTransaction, setClaimTransaction] = useState();
  const { sponsorTransactions, chainId } = useWalletContext();
  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => {
    if (!userAddress || !reward) return;

    const rewards = reward.rewards.filter(({ token: { address } }) => !tokenAddresses || tokenAddresses?.has(address));
    const addresses = rewards.map(({ token }) => token.address as `0x${string}`);
    const accumulatedRewards = rewards.map(({ amount }) => amount.toString());
    const proofs = rewards.map(({ proofs }) => proofs as `0x${string}`[]);

    return {
      userAddress,
      distributor: reward.distributor,
      args: [addresses.map(() => userAddress as `0x${string}`), addresses, accumulatedRewards, proofs],
    };
  }, [reward, userAddress, tokenAddresses]);

  const reload = useCallback(
    async function fetchTransaction() {
      if (!payload) return;

      setLoading(true);
      try {
        const tx = await InteractionService({ api }).get("claim", payload, {
          sponsor: sponsorTransactions && chainId === 324,
        });

        setClaimTransaction({ ...tx });
      } catch {}
      setLoading(false);
    },
    [payload, sponsorTransactions, chainId],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { claimTransaction, loading, reload };
}
