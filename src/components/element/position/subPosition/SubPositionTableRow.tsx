import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { type Component, Divider, Group, Icon, Text, mergeClass } from "dappkit";
import { useMemo } from "react";
import { parseUnits } from "viem";
import Token from "../../token/Token";
import { SubPositionRow } from "./SubPositionTable";

export type SubPositionTableRowProps = Component<{
  row: PositionT;
}>;

export default function SubPositionTableRow({ row, className, ...props }: SubPositionTableRowProps) {
  const tokenBalance0 = row.tokens?.[0]?.breakdown?.find(breakdown => breakdown?.type === "balance");
  const tokenBalance1 = row.tokens?.[1]?.breakdown?.find(breakdown => breakdown?.type === "balance");
  // const tokenLiquidity1 = row.tokens?.[0]?.breakdown?.filter(breakdown => breakdown?.type === "liquidity")[0];
  // const tokenLiquidity2 = row.tokens?.[1]?.breakdown?.filter(breakdown => breakdown?.type === "liquidity")[0];

  const tokenAmount1 = useMemo(
    () => parseUnits(tokenBalance0?.value.toString() ?? "", row.tokens[0]?.token?.decimals),
    [tokenBalance0, row?.tokens[0].token.decimals],
  );

  const tokenAmount2 = useMemo(
    () => parseUnits(tokenBalance1?.value.toString() ?? "", row.tokens[1]?.token?.decimals),
    [tokenBalance1, row?.tokens[1]?.token.decimals],
  );
  return (
    <>
      <Divider look="soft" />
      <SubPositionRow
        {...props}
        className={mergeClass("cursor-pointer", className)}
        sourceColumn={
          <Group className={"gap-sm"}>
            <Icon src={row.opportunity.protocol?.icon} />
            <Text>{row.opportunity.protocol?.name}</Text>
          </Group>
        }
        inRangeColumn={<Text>YES</Text>}
        liquidityColumn={<Group className="flex-nowrap">todo</Group>}
        token0Column={<Token size="sm" token={row.tokens[0]?.token} format="amount_price" amount={tokenAmount1} />}
        token1Column={<Token size="sm" token={row.tokens[1]?.token} format="amount_price" amount={tokenAmount2} />}
      />
    </>
  );
}

// {tokenBalance0[0].value}
