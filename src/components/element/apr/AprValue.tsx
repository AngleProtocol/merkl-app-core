import { textStyles } from "dappkit/src/components/primitives/Text";
import { tv } from "tailwind-variants";
import { mergeClass } from "dappkit/src/utils/css";
import type { Component, Styled } from "dappkit/src/utils/types";
import { useMerklConfig } from "@core/modules/config/config.context";
import { Value } from "packages/dappkit/src";
import { useMemo } from "react";

export const valueStyles = tv({
  base: "text-main-11 font-text font-normal",
  variants: {
    look: textStyles.variants.look,
    size: textStyles.variants.size,
  },
  defaultVariants: {
    look: "base",
    size: "md",
  },
});

export type ValueFormatProps = {
  children: number;
  format?: string;
  value?: boolean;
};
export type ValueProps = Component<Styled<typeof valueStyles> & ValueFormatProps, HTMLDivElement>;

export default function AprValue({ look, size, className, format, children, value }: ValueProps) {
  const decimalFormatApr = useMerklConfig(store => store.config.decimalFormat.apr);

  if (!children) return null;

  if (children < 0) return "0%";
  if (children > 10_000) return ">10K%"; // If APR is greater than 10_000%, display ">10K%"

  const aprValue = useMemo(() => children / 100, [children]);

  return (
    <Value
      value={value}
      format={format ?? decimalFormatApr}
      look={look}
      size={size}
      className={mergeClass(valueStyles, className)}>
      {aprValue}
    </Value>
  );
}
