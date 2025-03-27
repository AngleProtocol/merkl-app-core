import { actions } from "@core/config/actions";
import type { OpportunityView } from "@core/config/opportunity";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import useChains from "@core/modules/chain/hooks/useChains";
import { useMerklConfig } from "@core/modules/config/config.context";
import useProtocols from "@core/modules/protocol/hooks/useProtocols";
import type { Chain, Protocol } from "@merkl/api";
import { Form, useLocation, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { Button, Group, Icon, Input, Select, Text } from "dappkit";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
const filters = ["search", "action", "status", "chain", "protocol", "sort", "tvl"] as const;
export type OpportunityFilter = (typeof filters)[number];

export type OpportunityFilterProps = {
  only?: OpportunityFilter[];
  chains?: Chain[];
  setView?: (v: OpportunityView) => void;
  protocols?: Protocol[];
  exclude?: OpportunityFilter[];
  onClear?: () => void;
  clearing?: boolean;
};

//TODO: burn this to the ground and rebuild it with a deeper comprehension of search param states
export default function OpportunityFilters({
  only,
  protocols,
  exclude,
  chains,
  onClear,
  clearing,
}: OpportunityFilterProps) {
  const [_, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [applying, setApplying] = useState(false);

  const filtersConfigEnabled = useMerklConfig(store => store.config.opportunitiesFilters);
  const opportunityDefaultStatus = useMerklConfig(store => store.config.backend.opportunityDefaultStatus);

  //TODO: componentify theses
  const actionOptions = Object.entries(actions)
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

  const defaultSortBy = useMerklConfig(store => store.config.backend.sortedBy);

  const defaultSortPlaceholder = useMemo(
    () => filtersConfigEnabled?.[defaultSortBy.concat("-desc")].name,
    [defaultSortBy, filtersConfigEnabled],
  );

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

  const { options: protocolOptions, isSingleProtocol } = useProtocols(protocols);
  const {
    options: chainOptions,
    searchOptions: chainSearchOptions,
    indexOptions: chainIndexOptions,
    isSingleChain,
  } = useChains(chains);

  const [actionsFilter] = useSearchParamState<string[]>(
    "action",
    v => v?.join(","),
    v => v?.split(","),
  );

  const [actionsInput, setActionsInput] = useState<string[]>(actionsFilter ?? []);

  const [sortFilter] = useSearchParamState<string>(
    "sort",
    v => v,
    v => v,
  );
  const [sortInput, setSortInput] = useState<string>(sortFilter ?? "");

  const [statusFilter] = useSearchParamState<string[]>(
    "status",
    v => v?.join(","),
    v => v?.split(","),
  );

  const [statusInput, setStatusInput] = useState(statusFilter ?? opportunityDefaultStatus);

  const onStatusChange = useCallback((status: string[]) => {
    const uniqueStatus = Array.from(new Set(status.flatMap(s => s.split(","))));
    setStatusInput(uniqueStatus);
  }, []);

  const [chainIdsFilter] = useSearchParamState<string[]>(
    "chain",
    v => v?.join(","),
    v => v?.split(","),
  );
  const [chainIdsInput, setChainIdsInput] = useState<string[]>(chainIdsFilter ?? []);

  const [search] = useSearchParamState<string>(
    "search",
    v => v,
    v => v,
  );

  const [innerSearch, setInnerSearch] = useState<string | undefined>(search ?? "");

  const [protocolFilter] = useSearchParamState<string[]>(
    "protocol",
    v => v?.join(","),
    v => v?.split(","),
  );
  const [protocolInput, setProtocolInput] = useState<string[]>(protocolFilter ?? []);

  const fields = useMemo(() => {
    if (only) return filters.filter(f => only.includes(f));
    if (exclude) return filters.filter(f => !exclude.includes(f));
    return filters;
  }, [only, exclude]);

  const updateParams = useCallback(
    (key: string, value: string[], searchParams: URLSearchParams) => {
      if (!fields.includes(key as (typeof fields)[number])) return;

      if (value?.length === 0 || !value) searchParams.delete(key);
      else searchParams.set(key, value?.join(","));
    },
    [fields],
  );

  const updateStringParam = useCallback(
    (key: string, value: string, searchParams: URLSearchParams) => {
      if (!fields.includes(key as (typeof fields)[number])) return;

      if (!value) searchParams.delete(key);
      else searchParams.set(key, value);
    },
    [fields],
  );

  const canApply = useMemo(() => {
    const isSameArray = (a: string[] | undefined, b: string[] | undefined) =>
      a?.every(c => b?.includes(c)) && b?.every(c => a?.includes(c));

    const sameChains = isSameArray(chainIdsInput, chainIdsFilter);
    const sameActions = isSameArray(actionsInput, actionsFilter);
    const sameProtocols = isSameArray(protocolInput, protocolFilter);
    const sameSearch = (search ?? "") === innerSearch;
    const sameStatus = isSameArray(statusInput, statusFilter ?? opportunityDefaultStatus);

    return [sameChains, sameActions, sameStatus, sameSearch, sameProtocols].some(v => v === false);
  }, [
    chainIdsInput,
    chainIdsFilter,
    actionsInput,
    actionsFilter,
    statusFilter,
    protocolInput,
    protocolFilter,
    statusInput,
    search,
    innerSearch,
    opportunityDefaultStatus,
  ]);

  const onApplyFilters = useCallback(() => {
    setApplying(true);
    setSearchParams(params => {
      updateParams("chain", chainIdsInput, params);
      updateParams("action", actionsInput, params);
      updateParams("status", statusInput, params);
      updateParams("protocol", protocolInput, params);
      updateStringParam("search", innerSearch ?? "", params);
      return params;
    });
  }, [
    updateParams,
    updateStringParam,
    setSearchParams,
    chainIdsInput,
    actionsInput,
    statusInput,
    protocolInput,
    innerSearch,
  ]);

  function onClearFilters() {
    setApplying(false);

    navigate(location.pathname, { replace: true });
    setChainIdsInput([]);
    setProtocolInput([]);
    setStatusInput([]);
    setActionsInput([]);
    setInnerSearch("");
    setSortInput("");
    onClear?.();
  }

  useEffect(() => {
    if (navigation.state === "idle") {
      setApplying(false);
    }
  }, [navigation]);

  useEffect(() => {
    if (clearing) {
      setChainIdsInput([]);
      setProtocolInput([]);
      setStatusInput([]);
      setActionsInput([]);
      setInnerSearch("");
      setSortInput("");
      onClear?.();
    }
  }, [clearing, onClear]);

  const onSortByChange = useCallback(
    (sort: FormEvent<HTMLDivElement>) => {
      setSearchParams(params => {
        const updatedParams = new URLSearchParams(params.toString());
        if (!params.toString()) updatedParams.set("status", opportunityDefaultStatus.join(","));
        updatedParams.set("sort", sort.toString());
        return updatedParams;
      });
    },
    [setSearchParams, opportunityDefaultStatus],
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

  return (
    <Group className="justify-between flex-nowrap overflow-x-scroll">
      <Group className="items-center flex-nowrap">
        {fields.includes("search") && (
          <Form>
            <Input
              look="base"
              name="search"
              value={innerSearch}
              className="min-w-[12ch]"
              state={[innerSearch, setInnerSearch]}
              suffix={<Icon remix="RiSearchLine" />}
              placeholder="Search"
            />
          </Form>
        )}
        <Group size="lg" className="items-center flex-nowrap">
          <Group className="items-center flex-nowrap">
            {fields.includes("action") && (
              <Select
                state={[actionsInput, setActionsInput]}
                allOption={"All categories"}
                multiple
                options={actionOptions}
                look="tint"
                placeholder="Category"
                placeholderIcon={<Icon remix="RiLayoutMasonryFill" />}
              />
            )}
            {fields.includes("status") && (
              <Select
                state={[statusInput, onStatusChange]}
                multiple
                options={statusOptions}
                look="tint"
                placeholder="Status"
                placeholderIcon={<Icon remix="RiCheckboxCircleFill" />}
              />
            )}
            {fields.includes("chain") && !isSingleChain && (
              <Select
                state={[chainIdsInput, n => setChainIdsInput(n)]}
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
            )}
            {fields.includes("protocol") && !isSingleProtocol && (
              <Select
                state={[protocolInput, n => setProtocolInput(n)]}
                allOption={"All protocols"}
                multiple
                search
                options={protocolOptions}
                look="tint"
                placeholder="Protocol"
                placeholderIcon={<Icon remix="RiShapesFill" />}
              />
            )}
          </Group>
          <Group size="lg" className="flex-nowrap items-center">
            {((canApply && !clearing && navigation.state === "idle") ||
              (applying && !clearing && navigation.state === "loading")) && (
              <Button onClick={onApplyFilters} look="hype">
                Check
                {navigation.state === "loading" ? (
                  <Icon className="animate-spin" remix="RiLoader2Line" />
                ) : (
                  <Icon remix="RiArrowRightLine" />
                )}
              </Button>
            )}
            <Button onClick={onClearFilters} look="soft" size="xs" className="text-nowrap">
              Clear all filters
              <Icon remix="RiCloseLine" />{" "}
            </Button>
          </Group>
        </Group>
      </Group>
      <Select
        onChange={onSortByChange}
        state={[sortInput, setSortInput]}
        options={filteredSortOptions}
        look="hype"
        placeholder={defaultSortPlaceholder}
      />
    </Group>
  );
}
