import merklConfig from "@core/config";
import TokenTooltip from "@core/modules/token/components/TokenTooltip";
import type { Chain, Token as TokenType } from "@merkl/api";
import {
  Button,
  type ButtonProps,
  Dropdown,
  Group,
  Icon,
  type IconProps,
  PrimitiveTag,
  Value,
  sizeScale,
} from "dappkit";
import { Fragment, useMemo } from "react";
import { formatUnits } from "viem";

export type TokenProps = Omit<ButtonProps, "value"> & {
  token: TokenType;
  format?: "amount" | "price" | "amount_price" | "symbol";
  amount?: bigint;
  value?: boolean;
  symbol?: boolean;
  icon?: boolean;
  size?: IconProps["size"];
  chain?: Chain;
  showZero?: boolean;
};

export default function Token({
  size,
  token,
  amount,
  format = "amount",
  value,
  showZero = false,
  icon = true,
  symbol = true,
  chain,
  ...props
}: TokenProps) {
  const amountFormatted = amount ? formatUnits(amount, token.decimals) : "0";
  const amountUSD = !amount ? 0 : (token.price ?? 0) * Number.parseFloat(amountFormatted ?? "0");

  const display = useMemo(
    () => (
      <Fragment>
        {(format === "amount" || format === "symbol" || format === "amount_price") &&
          (!!amount || (amount === 0n && showZero)) && (
            <Value
              fallback={v => (v as string).includes("0.000") && "< 0.001"}
              className="text-right items-center flex font-title"
              look={"bold"}
              size={size}
              format="0,0.###a">
              {amountFormatted}
            </Value>
          )}{" "}
        {format !== "symbol" && icon && <Icon size={size} rounded src={token?.icon} />}
        {symbol && token?.symbol}
        {(format === "price" || format === "amount_price") && (!!amount || showZero) && (
          <Group className="shrink block">
            <PrimitiveTag noClick size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}>
              <Value
                className="text-right"
                look={"soft"}
                size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}
                format={merklConfig.decimalFormat.dollar}>
                {amountUSD}
              </Value>
            </PrimitiveTag>
          </Group>
        )}
      </Fragment>
    ),
    [token, format, amountFormatted, amountUSD, amount, symbol, icon, size, showZero],
  );

  if (value) return display;

  return (
    <Dropdown className="flex flex-col" content={<TokenTooltip {...{ token, amount, chain, size }} />}>
      <Button {...props} size={size} look="soft">
        {display}
      </Button>
    </Dropdown>
  );
}
