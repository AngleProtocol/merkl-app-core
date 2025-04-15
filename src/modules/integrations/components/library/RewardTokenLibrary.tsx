import { useMemo } from "react";
import type { Api } from "@core/index.generated";
import { RewardTokenTable } from "./RewardTokenTable";
import RewardTokenTableRow from "../element/RewardTokenTableRow";

export type RewardTokenLibraryProps = {
  rewardTokens: NonNullable<Awaited<ReturnType<Api["v4"]["tokens"]["reward"]["get"]>>["data"]>;
  count?: number;
};

export default function RewardTokenLibrary({ rewardTokens }: RewardTokenLibraryProps) {
  const rows = useMemo(
    () =>
      Object.values(rewardTokens)
        .flat()
        ?.map(rewardToken => <RewardTokenTableRow key={`${rewardToken.id}`} rewardToken={rewardToken} />),
    [rewardTokens],
  );

  return <RewardTokenTable>{rows}</RewardTokenTable>;
}
