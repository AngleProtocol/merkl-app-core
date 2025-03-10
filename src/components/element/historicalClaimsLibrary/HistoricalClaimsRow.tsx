import type { Api } from "@core/api/types";
import Tag from "@core/components/element/Tag";
import useChain from "@core/modules/chain/hooks/useChain";
import Token from "@core/modules/token/components/element/Token";
import { Button, Icon, type ListProps, mergeClass } from "dappkit";
import moment from "moment";
import { HistoricalClaimsRow } from "./HistoricalClaimsTable";

export type HistoricalClaimsRowProps = {
  claim: NonNullable<Awaited<ReturnType<ReturnType<Api["v4"]["claims"]>["get"]>>["data"]>[0];
} & ListProps;

export default function HistoricalClaimsTableRow({ claim, className, size, ...props }: HistoricalClaimsRowProps) {
  const { chain } = useChain({ id: claim?.token?.chainId });

  return (
    <HistoricalClaimsRow
      {...props}
      size={size}
      className={mergeClass("cursor-pointer", className)}
      chainColumn={chain && <Tag type="chain" value={chain} />}
      tokenColumn={
        !!claim?.token && (
          <Token token={claim?.token} format="amount_price" amount={BigInt(claim.amount)} chain={chain} />
        )
      }
      dateColumn={moment(claim.timestamp * 1000).format("DD MMMM YYYY ha")}
      transactionColumn={
        claim.txHash &&
        chain?.explorers &&
        chain.explorers.map(explorer => (
          <Button key={`${explorer.url}`} to={`${explorer.url}/tx/${claim.txHash}`} external size="xs" look="soft">
            Check
            <Icon remix="RiArrowRightUpLine" />
          </Button>
        ))
      }
    />
  );
}
