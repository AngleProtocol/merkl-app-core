import type { Campaign } from "@merkl/api";
import moment from "moment";
import { useMemo } from "react";

/**
 * Returns data about an array of campaigns
 * @param campaigns
 */
export default function useCampaigns(campaigns?: Campaign[]) {
  const [past, live, soon] = useMemo(() => {
    if (!campaigns) return [[], [], []];

    return [
      campaigns?.filter(({ endTimestamp: end }) => Number(end) < moment().unix()),
      campaigns?.filter(
        ({ startTimestamp: start, endTimestamp: end }) =>
          Number(end) > moment().unix() && Number(start) <= moment().unix(),
      ),
      campaigns?.filter(({ startTimestamp: start }) => Number(start) > moment().unix()),
    ];
  }, [campaigns]);

  return { past, live, soon };
}
