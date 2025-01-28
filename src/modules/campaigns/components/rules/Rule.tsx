import type { PrimitiveTagProps } from "dappkit";
import AddressListRule from "./AddressListRule";
import BooleanRule from "./BooleanRule";
import LiquidityRule from "./LiquidityRule";

export const RULES = {
  boolean: BooleanRule,
  liquidity: LiquidityRule,
  address: AddressListRule,
};
export type Rules = typeof RULES;

export type RuleType<T extends keyof Rules = keyof Rules> = {
  type: T;
  value: Parameters<Rules[T]>[0]["value"];
} & Omit<PrimitiveTagProps, "type" | "value">;

export default function Rule<T extends keyof Rules>({
  type,
  value,
  ...props
}: { type: T; value: RuleType<T>["value"] } & Omit<PrimitiveTagProps, "type" | "value">) {
  switch (type) {
    case "liquidity":
      return <LiquidityRule value={value as RuleType<"liquidity">["value"]} {...props} />;
    case "address":
      return <AddressListRule value={value as RuleType<"address">["value"]} {...props} />;
    case "boolean":
      return <BooleanRule value={value as RuleType<"boolean">["value"]} {...props} />;
    default:
      return;
  }
}
