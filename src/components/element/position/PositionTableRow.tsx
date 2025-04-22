import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityButton from "@core/modules/opportunity/components/OpportunityButton";
import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity/liquidity.model";
import { type Component, type ListProps, PrimitiveTag, Value, sizeScale } from "dappkit";
import { useMemo } from "react";
import { parseUnits } from "viem";
import Token from "../../../modules/token/components/element/Token";
import { PositionRow } from "./PositionTable";

export type PositionRowProps = Component<{
  row: PositionT;
}> &
  ListProps;

// Commented code can be implemented when we get breakdowns positions for CLAMM (subPositions)
export default function PositionTableRow({ row, className, ...props }: PositionRowProps) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  // const [_open, setOpen] = useState(false);
  // const subPositions = useMemo(() => {
  //   return <SubPositionTableRow key={crypto.randomUUID()} row={row} />;
  // }, [row]);

  const tokenBalance0 = useMemo(
    () => row.tokens?.[0]?.breakdown?.find(breakdown => breakdown?.type === "balance"),
    [row.tokens],
  );

  const tokenBalance1 = useMemo(
    () => row.tokens?.[1]?.breakdown?.find(breakdown => breakdown?.type === "balance"),
    [row.tokens],
  );

  const tokenAmount0 = useMemo(
    () => parseUnits(tokenBalance0?.value.toString() ?? "", row.tokens[0]?.token?.decimals),
    [tokenBalance0, row?.tokens[0]?.token.decimals],
  );

  const price0 = useMemo(
    () => (row.tokens[0]?.token?.price ?? 0) * Number(tokenBalance0?.value),
    [row.tokens[0]?.token?.price, tokenBalance0?.value],
  );
  const price1 = useMemo(
    () => (row.tokens[1]?.token?.price ?? 0) * Number(tokenBalance1?.value),
    [row.tokens[1]?.token?.price, tokenBalance1?.value],
  );

  const renderRowByCampaignType = useMemo(() => {
    // Implement this when we handle different display logic for different campaign types (as it should be collapsible for CLAMM example on figma) can be copy past as a child element of PositionRow
    /* <Collapsible state={[open, setOpen]}>
          <Space size="md" />
          <SubPositionTable dividerClassName={() => "!bg-main-8"} className="[&>*]:bg-main-4" look="soft">
            {subPositions}
          </SubPositionTable>
        </Collapsible> */

    switch (row.opportunity.type) {
      case "CLAMM":
        return (
          <PositionRow
            {...props}
            className={className}
            sourceColumn={<OpportunityButton opportunity={row.opportunity} />}
            liquidityColumn={
              <PrimitiveTag size={sizeScale[Math.max(sizeScale.indexOf("md") - 1, 0)]}>
                <Value
                  className="text-right"
                  look={"soft"}
                  size={sizeScale[Math.max(sizeScale.indexOf("md") - 1, 0)]}
                  format={dollarFormat}>
                  {price0 + price1}
                </Value>
              </PrimitiveTag>
            }
          />
        );

      default:
        return (
          <PositionRow
            {...props}
            className={className}
            sourceColumn={<OpportunityButton opportunity={row.opportunity} />}
            liquidityColumn={
              <Token size="sm" token={row.tokens[0]?.token} format="amount_price" amount={tokenAmount0} />
            }
          />
        );
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: passing {...props} is a bad habit -> props change on every render
  }, [row, dollarFormat, className, tokenAmount0, price0, price1, props]);

  return renderRowByCampaignType;
}
