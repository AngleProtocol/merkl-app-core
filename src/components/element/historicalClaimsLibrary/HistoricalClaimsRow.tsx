import { Button, type Component, Icon, mergeClass } from "dappkit";
import { Time } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo } from "react";
import Chain from "../../../modules/chain/components/element/Chain";
import type { ClaimsService } from "../../../modules/claim/claim.service";
import Token from "../token/Token";
import { HistoricalClaimsRow } from "./HistoricalClaimsTable";

export type HistoricalClaimsRowProps = Component<{
  claim: Awaited<ReturnType<typeof ClaimsService.getForUser>>[0];
}>;

export default function HistoricalClaimsTableRow({ claim, className, ...props }: HistoricalClaimsRowProps) {
  const { chains } = useWalletContext();

  const chain = useMemo(() => chains?.find(c => c.id === claim?.token?.chainId), [chains, claim]);

  return (
    <HistoricalClaimsRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      chainColumn={<Chain chain={chain} size="md" />}
      tokenColumn={
        !!claim?.token && (
          <Token token={claim?.token} format="amount_price" amount={BigInt(claim.amount)} chain={chain} />
        )
      }
      dateColumn={<Time timestamp={claim.timestamp * 1000} />}
      transactionColumn={
        claim.txHash &&
        chain?.explorers &&
        chain.explorers.map(explorer => (
          <Button key={`${explorer.url}`} to={`${explorer.url}/tx/${claim.txHash}`} external size="xs" look="soft">
            <Icon remix="RiArrowRightLine" />
            Inspect
          </Button>
        ))
      }
    />
  );
}
