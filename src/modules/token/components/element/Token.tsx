import { useMerklConfig } from "@core/modules/config/config.context";
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
  const decimalFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const tokenAddressesToHidePrice = useMerklConfig(store => store.config.hideRewardTokenPrice);

  const display = useMemo(() => {
    const shouldHidePrice = tokenAddressesToHidePrice?.some(
      address => address.toLowerCase() === token.address.toLowerCase(),
    );

    switch (format) {
      case "amount_price":
        return (
          <Fragment>
            <PrimitiveTag className="items-center font-title" size={size}>
              <Icon size={size} rounded src={token?.icon} />
              <Value
                value
                fallback={v => (v as string).includes("0.000") && "< 0.001"}
                look={"bold"}
                size={size}
                format="0,0.###a">
                {amountFormatted}
              </Value>
              {symbol && <span>{token?.symbol}</span>}
            </PrimitiveTag>
            {!shouldHidePrice && (
              <Value className="text-right" look={"soft"} size={size} format={decimalFormat}>
                {amountUSD}
              </Value>
            )}
          </Fragment>
        );
      //TODO: refactor all other format into individual blocks
      default:
        return (
          <Fragment>
            {(format === "amount" || format === "symbol") && (!!amount || (amount === 0n && showZero)) && (
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
            {format === "price" && !!amount && (
              <Group className="shrink block">
                <PrimitiveTag size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}>
                  <Value
                    className="text-right"
                    look={"soft"}
                    size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}
                    format={decimalFormat}>
                    {amountUSD}
                  </Value>
                </PrimitiveTag>
              </Group>
            )}
          </Fragment>
        );
    }
  }, [
    token,
    format,
    amountFormatted,
    amountUSD,
    amount,
    symbol,
    icon,
    size,
    showZero,
    decimalFormat,
    tokenAddressesToHidePrice,
  ]);

  if (value) return display;
  return (
    <Dropdown className="flex flex-col" content={<TokenTooltip {...{ token, amount, chain, size }} />}>
      <Button {...props} size={size} look="soft">
        {display}
      </Button>
    </Dropdown>
  );
}
