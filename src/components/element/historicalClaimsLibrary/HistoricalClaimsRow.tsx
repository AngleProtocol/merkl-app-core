import { Button, type Component, Icon, mergeClass } from "dappkit";
import Time from "packages/dappkit/src/components/primitives/Time";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import type { ClaimsService } from "src/api/services/claims.service";
import Chain from "../chain/Chain";
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
