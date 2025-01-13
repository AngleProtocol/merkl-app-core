import type { Token as TokenType } from "@merkl/api";
import { type Component, Group, PrimitiveTag, Text, Value, mergeClass } from "dappkit";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import type { RewardService } from "src/api/services/reward.service";
import { formatUnits } from "viem";
import Token from "../token/Token";
import User from "../user/User";
import { LeaderboardRow, LeaderboardRowWithoutReason } from "./LeaderboardTable";

export type LeaderboardTableRowProps = Component<{
  row: Awaited<ReturnType<typeof RewardService.getManyFromRequest>>["rewards"][0];
  total: bigint;
  rank: number;
  token: TokenType;
  chain: number;
  withReason: boolean;
}>;

export default function LeaderboardTableRow({ row, rank, total, className, ...props }: LeaderboardTableRowProps) {
  const { token, chain: chainId, withReason } = props;
  const { chains } = useWalletContext();

  const Row = withReason ? LeaderboardRow : LeaderboardRowWithoutReason;

  const share = useMemo(() => {
    const amount = formatUnits(BigInt(row?.amount) + BigInt(row?.pending ?? 0), token.decimals);
    const all = formatUnits(total, token.decimals);

    return Number.parseFloat(amount) / Number.parseFloat(all);
  }, [row, total, token]);

  const chain = useMemo(() => {
    return chains?.find(c => c.id === chainId);
  }, [chains, chainId]);

  return (
    <Row
      {...props}
      className={mergeClass("cursor-pointer", className)}
      rankColumn={
        <Group className="flex-nowrap">
          <PrimitiveTag className="pointer-events-none" look="bold">
            #{rank}
          </PrimitiveTag>
          <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
            <Value format="0.#%">{share}</Value>
          </PrimitiveTag>
        </Group>
      }
      addressColumn={<User chain={chain} address={row.recipient} />}
      rewardsColumn={<Token token={token} format="amount_price" amount={BigInt(row?.amount) + BigInt(row?.pending)} />}
      protocolColumn={withReason ? <Text>{row?.reason?.split("_")[0]}</Text> : undefined}
    />
  );
}
