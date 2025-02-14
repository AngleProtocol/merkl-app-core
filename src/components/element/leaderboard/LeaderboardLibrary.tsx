import { DEFAULT_ITEMS_PER_PAGE } from "@core/constants/pagination";
import type { RewardService } from "@core/modules/reward/reward.service";
import type { Chain, Token } from "@merkl/api";
import { useSearchParams } from "@remix-run/react";
import { Group, Text, Title } from "dappkit";
import { useMemo } from "react";
import Pagination from "../Pagination";
import { LeaderboardTable, LeaderboardTableWithoutReason } from "./LeaderboardTable";
import LeaderboardTableRow from "./LeaderboardTableRow";

export type LeaderboardLibraryProps = {
  leaderboard: Awaited<ReturnType<typeof RewardService.getCampaignLeaderboard>>["rewards"];
  count?: number;
  total?: bigint;
  reason: boolean;
  token: Token;
  chain: Chain;
};

export default function LeaderboardLibrary(props: LeaderboardLibraryProps) {
  const { leaderboard, count, total, token, chain, reason } = props;
  const [searchParams] = useSearchParams();

  const items = searchParams.get("items") ?? DEFAULT_ITEMS_PER_PAGE;
  const page = searchParams.get("page");

  const Table = reason ? LeaderboardTable : LeaderboardTableWithoutReason;

  const rows = useMemo(() => {
    return leaderboard?.map((row, index) => (
      <LeaderboardTableRow
        key={`${row.recipient}_${row.reason}_${row.amount}`}
        total={BigInt(total ?? 0n)}
        row={row}
        showreason={reason}
        rank={index + 1 + Math.max(Number(page) - 1, 0) * Number(items)}
        token={token}
        chain={chain}
      />
    ));
  }, [leaderboard, page, items, total, token, chain, reason]);

  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      {!!rows?.length ? (
        <Table
          responsive
          dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
          header={
            <Title h={5} className="!text-main-11 w-full">
              Leaderboard
            </Title>
          }
          footer={count !== undefined && <Pagination count={count} />}>
          {rows}
        </Table>
      ) : (
        <Text className="p-xl">No rewarded users</Text>
      )}
    </Group>
  );
}
