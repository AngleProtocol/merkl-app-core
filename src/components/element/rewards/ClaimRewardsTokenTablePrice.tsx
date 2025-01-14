import { Group, PrimitiveTag, Value } from "dappkit";
import type { PropsWithChildren } from "react";
import { formatUnits } from "viem";
import merklConfig from "../../../config";

export type ClaimRewardsTokenTablePriceProps = PropsWithChildren & {
  price: number | null;
  amount: bigint;
  decimals: number;
};

export default function ClaimRewardsTokenTablePrice({ amount, price, decimals }: ClaimRewardsTokenTablePriceProps) {
  const value = formatUnits(amount, decimals);

  if (value === "0") return;
  return (
    <Group size="md" className="flex-row  flex-nowrap items-center">
      <Value
        fallback={v => (v as string).includes("0.000") && "< 0.001"}
        className="text-right items-center flex font-title"
        look={"bold"}
        format="0,0.###">
        {value}
      </Value>
      <PrimitiveTag size="xs">
        <Value
          fallback={v => {
            if (price === 0) return "-";
            return (v.toString() as string).includes("0.0") && "< $0.1";
          }}
          size="xs"
          className="text-right items-center flex font-title"
          look={"bold"}
          format={merklConfig.decimalFormat.dollar}>
          {Number.parseFloat(value) * (price ?? 0)}
        </Value>
      </PrimitiveTag>
    </Group>
  );
}
