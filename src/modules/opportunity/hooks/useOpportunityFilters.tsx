import { actions as allActions } from "@core/config/actions";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import { useMerklConfig } from "@core/modules/config/config.context";
import { useSearchParams } from "@remix-run/react";
import { Group, Icon, Text } from "packages/dappkit/src";
import { useCallback, useMemo, useState } from "react";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

/**
 * Provide function to filters opportunities through searchparams
 * @improvment externalize options
 */
export default function useOpportunityFilters() {
  const filtersConfigEnabled = useMerklConfig(store => store.config.opportunitiesFilters);

  // Get default values from config
  const defaultStatus = useMerklConfig(store => store.config.backend.opportunityDefaultStatus);
  const sortByConfig = useMerklConfig(store => store.config.backend.sortedBy);
  const defaultSortKey = useMemo(() => sortByConfig.concat("-desc"), [sortByConfig]);

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort] = useSearchParamState<keyof typeof filteredSortOptions>(
    "sort",
    v => v,
    v => v as keyof typeof filteredSortOptions,
  );

  const [actions, setActions] = useSearchParamState<string[]>(
    "action",
    v => v?.join(","),
    v => v?.split(","),
  );

  const [status, setStatus] = useSearchParamState<string[]>(
    "status",
    v => v?.join(","),
    v => v?.split(","),
  );
  const [chainIds, setChainIds] = useSearchParamState<string[]>(
    "chain",
    v => v?.join(","),
    v => v?.split(","),
  );

  const [protocols, setProtocols] = useSearchParamState<string[]>(
    "protocol",
    v => v?.join(","),
    v => v?.split(","),
  );

  const [, setSearch] = useSearchParamState<string>(
    "search",
    v => v,
    v => v,
  );

  // Allow setting params on debounced value
  // useEffect(() => {
  //   if (searchTerm === undefined || debouncedSearch === undefined) return;
  //   if (debouncedSearch === search) return;
  //   if (debouncedSearch === "") {
  //     if (searchTerm === debouncedSearch && search === undefined) return;
  //     const newSearchParams = new URLSearchParams(searchParams);
  //     newSearchParams.delete("search");
  //     setSearchParams(newSearchParams);
  //     return;
  //   }
  //   setSearch(debouncedSearch as string);
  // }, [debouncedSearch, search, searchParams, searchTerm, setSearch, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(undefined);
    setSearchTerm(undefined);
  }, [setSearchParams]);

  const toggleSortOrder = useCallback(
    (baseParam: string, initialOrder: SortOrder = SortOrder.ASC) => {
      const currentSort = searchParams.get("sort") ?? "";
      let nextOrder: SortOrder;

      if (!currentSort) {
        nextOrder = initialOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      } else {
        const isDesc = currentSort === `${baseParam}-desc`;
        nextOrder = isDesc ? SortOrder.ASC : SortOrder.DESC;
      }

      const newParam = `${baseParam}-${nextOrder}`;
      if (!filtersConfigEnabled[newParam]) return;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("sort", newParam);
      setSearchParams(newSearchParams);
    },
    [filtersConfigEnabled, searchParams, setSearchParams],
  );

  const executeSearch = useCallback(() => {
    setSearch(searchTerm ?? "");
  }, [searchTerm, setSearch]);

  const sortOptions = useMemo(() => {
    return {
      "apr-asc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["apr-asc"].name || "By APR"}</Text>
          <Icon remix="RiArrowUpLine" />
        </Group>
      ),
      "apr-desc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["apr-desc"].name || "By APR"}</Text>
          <Icon remix="RiArrowDownLine" />
        </Group>
      ),
      "tvl-asc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["tvl-asc"].name || "By TVL"}</Text>
          <Icon remix="RiArrowUpLine" />
        </Group>
      ),
      "tvl-desc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["tvl-desc"].name || "By TVL"}</Text>
          <Icon remix="RiArrowDownLine" />
        </Group>
      ),
      "rewards-asc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["rewards-asc"]?.name || "By Daily Rewards"}</Text>
          <Icon remix="RiArrowUpLine" />
        </Group>
      ),
      "rewards-desc": (
        <Group className="flex-nowrap !gap-sm">
          <Text look="bold">{filtersConfigEnabled?.["rewards-desc"]?.name || "By Daily Rewards"}</Text>
          <Icon remix="RiArrowDownLine" />
        </Group>
      ),
    };
  }, [filtersConfigEnabled]);

  const statusOptions = {
    "LIVE,SOON,PAST": <>All status</>,
    LIVE: (
      <>
        <Icon size="sm" remix="RiFlashlightLine" /> Live
      </>
    ),
    SOON: (
      <>
        <Icon size="sm" remix="RiTimerLine" /> Soon
      </>
    ),
    PAST: (
      <>
        <Icon size="sm" remix="RiHistoryLine" /> Past
      </>
    ),
  };

  const actionOptions = Object.entries(allActions)
    .filter(([key]) => key !== "INVALID")
    .reduce(
      (obj, [action, { icon, label }]) =>
        Object.assign(obj, {
          [action]: (
            <>
              <Icon size="sm" {...icon} />
              {label}
            </>
          ),
        }),
      {},
    );

  const filteredSortOptions = useMemo(() => {
    return Object.keys(sortOptions)
      .filter((key): key is keyof typeof sortOptions => key in filtersConfigEnabled)
      .reduce(
        (acc, key) => {
          acc[key] = sortOptions[key];
          return acc;
        },
        {} as Partial<typeof sortOptions>,
      );
  }, [filtersConfigEnabled, sortOptions]);

  return {
    toggleSortOrder,
    clearFilters,
    filtersState: {
      protocolsFilter: { input: protocols, setInput: setProtocols },
      actionsFilter: {
        input: actions,
        setInput: setActions,
        options: actionOptions,
      },
      statusFilter: {
        input: status ?? defaultStatus,
        setInput: setStatus,
        options: statusOptions,
      },
      chainIdsFilter: { input: chainIds, setInput: setChainIds },
      searchFilter: { input: searchTerm, setInput: setSearchTerm, executeSearch },
      sortFilter: {
        input: sort ?? (defaultSortKey as keyof typeof filteredSortOptions),
        setInput: setSort,
        options: filteredSortOptions,
      },
    },
  };
}
