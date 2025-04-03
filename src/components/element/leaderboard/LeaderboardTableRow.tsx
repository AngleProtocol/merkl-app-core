import type { Api } from "@core/api/types";
import type { Chain, Token as TokenType } from "@merkl/api";
import { type Component, Group, type ListProps, PrimitiveTag, Text, Value, mergeClass } from "dappkit";
import { useMemo } from "react";
import { formatUnits } from "viem";
import Token from "../../../modules/token/components/element/Token";
import User from "../user/User";
import { LeaderboardRow, LeaderboardRowWithoutReason } from "./LeaderboardTable";

export type LeaderboardTableRowProps = Component<{
  row: NonNullable<Awaited<ReturnType<Api["v4"]["rewards"]["index"]["get"]>>["data"]>["0"];
  total: bigint;
  rank: number;
  token: TokenType;
  chain: Chain;
  showreason: boolean;
}> &
  ListProps;

export default function LeaderboardTableRow({
  row,
  rank,
  total,
  className,
  showreason,
  token,
  chain,
  ...props
}: LeaderboardTableRowProps) {
  const share = useMemo(() => {
    const amount = formatUnits(BigInt(row?.amount) + BigInt(row?.pending ?? 0), token.decimals);
    const all = formatUnits(total, token.decimals);

    return Number.parseFloat(amount) / Number.parseFloat(all);
  }, [row, total, token]);

  return showreason ? (
    <LeaderboardRow
      className={mergeClass("cursor-pointer bg-main-2", className)}
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
      protocolColumn={<Text>{row?.reason?.split("_")[0]}</Text>}
    />
  ) : (
    <LeaderboardRowWithoutReason
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
    />
  );
}
