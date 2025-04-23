import { useMerklConfig } from "@core/modules/config/config.context";
import { Value } from "dappkit";
import { useMemo } from "react";

export type ValueFormatProps = {
  children: number | string;
  format?: string;
  value?: boolean;
};

export default function AprValue({ format, children, value, ...props }: ValueFormatProps) {
  const decimalFormatApr = useMerklConfig(store => store.config.decimalFormat.apr);

  if (!children) return null;
  if (typeof children === "string") return children;
  if (children < 0) return "0%";
  if (children > 10_000) return ">10K%"; // If APR is greater than 10_000%, display ">10K%"
  if (children < 0.1) return "<0.1%"; // If APR is under 0.1%, display "<0.1%"

  const aprValue = useMemo(() => children / 100, [children]);

  return (
    <Value value={value} format={format ?? decimalFormatApr} {...props}>
      {aprValue}
    </Value>
  );
}
