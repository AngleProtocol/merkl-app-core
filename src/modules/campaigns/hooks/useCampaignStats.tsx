import { api } from "@core/api";
import { RewardService } from "@core/modules/reward/reward.service";
import { useCallback, useEffect, useState } from "react";

export default function useCampaignStats(chainId: number, campaignId: string) {
  const [allStats, setAllStats] = useState<{ [campaignId: string]: { count: number; total: { amount: bigint } } }>({});
  const [loading, setLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const reload = useCallback(async () => {
    async function fetchTarget() {
      if (!campaignId) return;
      if (!!allStats[chainId + campaignId]) return;

      setLoading(true);

      try {
        const _stats = await RewardService({ api }).getCampaignStats(chainId, campaignId);

        if (_stats)
          setAllStats(s => {
            s[chainId + campaignId] = _stats;
            return s;
          });
      } catch {}
      setLoading(false);
    }

    !allStats[chainId + campaignId] && fetchTarget();
  }, [chainId, campaignId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { loading, stats: allStats[chainId + campaignId] };
}
