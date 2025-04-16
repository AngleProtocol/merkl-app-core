import { useMemo } from "react";
import { useChains, type Api } from "@core/index.generated";
import { RewardTokenTable } from "./RewardTokenTable";
import RewardTokenTableRow from "../element/RewardTokenTableRow";
import { Box, Button, Group, Icon, Select } from "packages/dappkit/src";
import useOpportunityFilters from "@core/modules/opportunity/hooks/useOpportunityFilters";
import type { Chain } from "@merkl/api";

export type RewardTokenLibraryProps = {
  rewardTokens: NonNullable<Awaited<ReturnType<Api["v4"]["tokens"]["reward"]["get"]>>["data"]>;
  chains: Chain[];
};

export default function RewardTokenLibrary({ rewardTokens, chains }: RewardTokenLibraryProps) {
  const {
    options: chainOptions,
    searchOptions: chainSearchOptions,
    indexOptions: chainIndexOptions,
  } = useChains(chains);

  const rows = useMemo(
    () =>
      Object.values(rewardTokens)
        .flat()
        ?.map(rewardToken => <RewardTokenTableRow key={`${rewardToken.id}`} rewardToken={rewardToken} />),
    [rewardTokens],
  );

  const { filtersState, clearFilters } = useOpportunityFilters();

  return (
    <>
      <Box content="sm" className="mb-lg justify-between w-full overflow-x-hidden flex">
        <Group className="items-center flex-nowrap">
          <Select
            state={[
              filtersState.chainIdsFilter.input ?? [],
              (ids: string[]) => {
                filtersState.chainIdsFilter.setInput(ids);
              },
            ]}
            allOption={"All chains"}
            multiple
            search
            options={chainOptions}
            searchOptions={chainSearchOptions}
            indexOptions={chainIndexOptions}
            look="tint"
            placeholder="Chain"
            placeholderIcon={<Icon remix="RiLink" />}
          />
          <Button onClick={clearFilters} look="soft" size="xs" className="text-nowrap">
            Clear all filters
            <Icon remix="RiCloseLine" />
          </Button>
        </Group>
      </Box>
      <RewardTokenTable>{rows}</RewardTokenTable>
    </>
  );
}
