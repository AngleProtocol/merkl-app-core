import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { UserTransaction } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReferralService } from "../referral.service";

export default function useReferrer() {
  const referralKey = useMerklConfig(store => store.config.referral?.referralKey);
  const { chainId, address } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState<{
    code: string;
    referredUsers: string[];
    referrer: boolean;
    transaction?: UserTransaction;
  }>();
  const isReferrer = useMemo(() => {
    return referral?.referrer;
  }, [referral]);

  const reload = useCallback(
    async function fetchReferral() {
      if (!chainId || !address || !referralKey) return;

      setLoading(true);

      try {
        const _referral = await ReferralService({ api }).getCodeOrTransaction(chainId, referralKey, address);

        if (_referral) setReferral(_referral);
      } catch {}
      setLoading(false);
    },
    [chainId, address, referralKey],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { isReferrer, referral, loading, reload };
}
