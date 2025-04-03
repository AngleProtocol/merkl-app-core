import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Value } from "dappkit";
import type { ValueProps } from "dappkit";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

const metrics = ["dailyRewards", "apr", "tvl"] satisfies (keyof Opportunity)[];

/**
 * Formats metrics for a given opportunity
 */
export default function useOpportunityMetrics({ dailyRewards, apr, tvl }: Pick<Opportunity, (typeof metrics)[number]>) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  /**
   * Main metrics formatted for page headers
   */
  const headerMetrics = useMemo(() => {
    const metricsDefinition = {
      "Daily Rewards": [dailyRewards, { format: dollarFormat }],
      APR: [apr / 100, { format: "0.00%" }],
      "Total value locked": [tvl, { format: dollarFormat }],
    } satisfies { [label: string]: [number | string, ValueProps] };

    return Object.entries(metricsDefinition satisfies { [label: string]: [number | string, ValueProps] })
      .filter(([, [value]]) => !!value)
      .map(([label, [value, props]]) => ({
        label,
        data: <Value children={value} size={4} className="!text-main-12" {...props} />,
        key: uuidv4(),
      }));
  }, [dailyRewards, apr, tvl, dollarFormat]);

  return { headerMetrics };
}
