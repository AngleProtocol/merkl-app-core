import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { UserTransaction } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useWalletContext } from "dappkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReferralService } from "../referral.service";

export default function useReferral(code?: string) {
  const referralKey = useMerklConfig(store => store.config.referral?.referralKey);
  const { chainId, address } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState<{ code: string; referrer?: string; transaction?: UserTransaction }>();
  const isCodeAvailable = useMemo(() => {
    return !!referral?.referrer;
  }, [referral]);

  const reload = useCallback(
    async function fetchReferral() {
      if (!chainId || !address || !code || !referralKey) return;

      setLoading(true);

      try {
        const _referral = await ReferralService({ api }).getReferralTransaction(chainId, referralKey, code);

        if (_referral) setReferral(_referral);
      } catch {}
      setLoading(false);
    },
    [chainId, address, code, referralKey],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { isCodeAvailable, referral, loading, reload };
}
