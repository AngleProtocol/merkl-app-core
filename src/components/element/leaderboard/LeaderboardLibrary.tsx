import type { Token } from "@merkl/api";
import { useSearchParams } from "@remix-run/react";
import { Group, Text, Title } from "dappkit";
import { useMemo } from "react";
import type { RewardService } from "src/api/services/reward.service";
import { v4 as uuidv4 } from "uuid";
import Pagination from "../opportunity/Pagination";
import { LeaderboardTable, LeaderboardTableWithoutReason } from "./LeaderboardTable";
import LeaderboardTableRow from "./LeaderboardTableRow";

export type IProps = {
  leaderboard: Awaited<ReturnType<(typeof RewardService)["getManyFromRequest"]>>["rewards"];
  count?: number;
  total?: bigint;
  withReason: boolean;
  token: Token;
  chain: number;
};

export default function LeaderboardLibrary(props: IProps) {
  const { leaderboard, count, total, token, chain, withReason } = props;
  const [searchParams] = useSearchParams();

  const items = searchParams.get("items");
  const page = searchParams.get("page");

  const Table = withReason ? LeaderboardTable : LeaderboardTableWithoutReason;

  const rows = useMemo(() => {
    return leaderboard?.map((row, index) => (
      <LeaderboardTableRow
        key={uuidv4()}
        total={BigInt(total ?? 0n)}
        row={row}
        withReason={withReason}
        rank={index + 1 + Math.max(Number(page) - 1, 0) * Number(items)}
        token={token}
        chain={chain}
      />
    ));
  }, [leaderboard, page, items, total, token, chain, withReason]);

  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      {!!rows?.length ? (
        <Table
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
