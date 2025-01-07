import type { Chain, Protocol } from "@merkl/api";
import { Form, useLocation, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { Button, Group, Icon, Input, Select } from "dappkit";
import config from "merkl.config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { actions } from "src/config/actions";
import type { OpportunityView } from "src/config/opportunity";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";
import useChains from "src/hooks/resources/useChains";
import useProtocols from "src/hooks/resources/useProtocols";
const filters = ["search", "action", "status", "chain", "protocol", "tvl", "sort"] as const;
export type OpportunityFilter = (typeof filters)[number];

export type OpportunityFilterProps = {
  only?: OpportunityFilter[];
  chains?: Chain[];
  view?: OpportunityView;
  setView?: (v: OpportunityView) => void;
  protocols?: Protocol[];
  exclude?: OpportunityFilter[];
};

//TODO: burn this to the ground and rebuild it with a deeper comprehension of search param states
export default function OpportunityFilters({
  only,
  protocols,
  exclude,
  chains,
  view,
  setView,
}: OpportunityFilterProps) {
  const [_, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [applying, setApplying] = useState(false);
  const [clearing, setClearing] = useState(false);

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

  const sortOptions = {
    "apr-asc": (
      <Group>
        By APR
        <Icon remix="RiArrowUpLine" />
      </Group>
    ),
    "apr-desc": (
      <Group>
        By APR
        <Icon remix="RiArrowDownLine" />
      </Group>
    ),
    "tvl-asc": (
      <Group>
        By TVL
        <Icon remix="RiArrowUpLine" />
      </Group>
    ),
    "tvl-desc": (
      <Group>
        By TVL
        <Icon remix="RiArrowDownLine" />
      </Group>
    ),
    "rewards-asc": (
      <Group>
        By rewards
        <Icon remix="RiArrowUpLine" />
      </Group>
    ),
    "rewards-desc": (
      <Group>
        By rewards
        <Icon remix="RiArrowDownLine" />
      </Group>
    ),
  };

  const statusOptions = {
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

  const { options: protocolOptions } = useProtocols(protocols);
  const { options: chainOptions, isSingleChain } = useChains(chains);

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
  const [statusInput, setStatusInput] = useState(statusFilter ?? []);

  const [chainIdsFilter] = useSearchParamState<string[]>(
    "chain",
    v => v?.join(","),
    v => v?.split(","),
  );
  const [chainIdsInput, setChainIdsInput] = useState<string[]>(chainIdsFilter ?? []);

  const [search, setSearch] = useSearchParamState<string>(
    "search",
    v => v,
    v => v,
  );

  const [innerSearch, setInnerSearch] = useState<string>(search ?? "");

  const [tvlFilter] = useSearchParamState<string>(
    "tvl",
    v => v,
    v => v,
  );

  const [tvlInput, setTvlInput] = useState<string>(tvlFilter ?? "");

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

  function onSearchSubmit() {
    if (!innerSearch || innerSearch === search) return;

    setSearch(innerSearch);
  }

  const updateParams = useCallback(
    (key: string, value: string[], searchParams: URLSearchParams) => {
      if (!fields.includes(key as (typeof fields)[number])) return;

      if (value?.length === 0 || !value) searchParams.delete(key);
      else searchParams.set(key, value?.join(","));
    },
    [fields],
  );

  const canApply = useMemo(() => {
    const isSameArray = (a: string[] | undefined, b: string[] | undefined) =>
      a?.every(c => b?.includes(c)) && b?.every(c => a?.includes(c));

    const sameChains = isSameArray(chainIdsInput, chainIdsFilter);
    const sameActions = isSameArray(actionsInput, actionsFilter);
    const sameStatus = isSameArray(statusInput, statusFilter);
    const sameProtocols = isSameArray(protocolInput, protocolFilter);
    const sameTvl = tvlFilter === tvlInput || tvlInput === "";
    const sameSort = sortFilter === sortInput || sortInput === "";
    const sameSearch = (search ?? "") === innerSearch;

    return [sameChains, sameActions, sameTvl, sameStatus, sameSearch, sameProtocols, sameSort].some(v => v === false);
  }, [
    chainIdsInput,
    chainIdsFilter,
    actionsInput,
    actionsFilter,
    statusFilter,
    tvlFilter,
    tvlInput,
    protocolInput,
    protocolFilter,
    statusInput,
    search,
    innerSearch,
    sortFilter,
    sortInput,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: needed fo sync
  useEffect(() => {
    setActionsInput(actionsFilter ?? []);
    setStatusInput(statusFilter ?? []);
  }, [location.search]);

  function onApplyFilters() {
    setApplying(true);
    setClearing(false);
    setSearchParams(params => {
      updateParams("chain", chainIdsInput, params);
      updateParams("action", actionsInput, params);
      updateParams("status", statusInput, params);
      updateParams("protocol", protocolInput, params);
      tvlInput && updateParams("tvl", [tvlInput], params);
      sortInput && updateParams("sort", [sortInput], params);

      return params;
    });
  }

  function onClearFilters() {
    setApplying(false);
    setClearing(true);

    navigate(location.pathname, { replace: true });
    setChainIdsInput([]);
    setProtocolInput([]);
    setStatusInput([]);
    setActionsInput([]);
    setTvlInput("");
    setInnerSearch("");
    setSortInput("");
  }

  useEffect(() => {
    if (navigation.state === "idle") {
      setApplying(false);
      setClearing(false);
    }
  }, [navigation]);

  return (
    <Group className="justify-between flex-nowrap">
      <Group
        className={`items-center flex-nowrap w-full ${config.opportunityLibrary?.views?.length === 1 ? "justify-between" : ""}`}>
        {fields.includes("search") && (
          <Form>
            <Input
              look="base"
              name="search"
              value={innerSearch}
              className="min-w-[12ch]"
              state={[innerSearch, v => setInnerSearch(v ?? "")]}
              suffix={<Icon remix="RiSearchLine" />}
              onClick={onSearchSubmit}
              size="sm"
              placeholder="Search"
            />
          </Form>
        )}
        <Group
          className={`items-center ${config.opportunityLibrary?.views?.length === 1 ? "flex-wrap flex-row-reverse" : ""}`}>
          <Group className="items-center">
            {fields.includes("action") && (
              <Select
                state={[actionsInput, setActionsInput]}
                allOption={"All actions"}
                multiple
                options={actionOptions}
                look="tint"
                placeholder="Actions"
              />
            )}
            {fields.includes("status") && (
              <Select
                state={[statusInput, setStatusInput]}
                allOption={"All status"}
                multiple
                options={statusOptions}
                look="tint"
                placeholder="Status"
              />
            )}
            {fields.includes("chain") && !isSingleChain && (
              <Select
                state={[chainIdsInput, n => setChainIdsInput(n)]}
                allOption={"All chains"}
                multiple
                search
                options={chainOptions}
                look="tint"
                placeholder="Chains"
              />
            )}
            {fields.includes("protocol") && (
              <Select
                state={[protocolInput, n => setProtocolInput(n)]}
                allOption={"All protocols"}
                multiple
                search
                options={protocolOptions}
                look="tint"
                placeholder="Protocols"
              />
            )}
            {fields.includes("tvl") && (
              <Form>
                <Input
                  state={[tvlInput, n => (/^\d+$/.test(n ?? "") || !n) && setTvlInput(n ?? "")]}
                  look="base"
                  name="tvl"
                  value={tvlInput}
                  className="min-w-[4ch]"
                  suffix={<Icon remix="RiFilter2Line" />}
                  placeholder="Minimum TVL"
                />
              </Form>
            )}
            {view === "cells" && (
              <Select state={[sortInput, setSortInput]} options={sortOptions} look="tint" placeholder="Sort by" />
            )}
          </Group>
          <Group
            className={`${config.opportunityLibrary?.views?.length === 1 ? "flex-row-reverse flex-wrap" : ""} items-center`}>
            {((canApply && !clearing && navigation.state === "idle") ||
              (applying && !clearing && navigation.state === "loading")) && (
              <Button onClick={onApplyFilters} look="bold">
                Apply
                {navigation.state === "loading" ? (
                  <Icon className="animate-spin" remix="RiLoader2Line" />
                ) : (
                  <Icon remix="RiArrowRightLine" />
                )}
              </Button>
            )}
            <Button onClick={onClearFilters} look="soft">
              {config.opportunityLibrary?.views?.length !== 1 && <Icon remix="RiCloseLine" />}
              Clear filters
              {config.opportunityLibrary?.views?.length === 1 && <Icon remix="RiCloseLine" />}
            </Button>
          </Group>
        </Group>
      </Group>
      {(config.opportunityLibrary?.views == null || config.opportunityLibrary?.views?.length > 1) && view && (
        <Group className="flex-nowrap">
          <Button disabled={view === "cells"} look="soft" onClick={() => setView?.("cells")}>
            <Icon remix="RiDashboardFill" />
          </Button>
          <Button disabled={view === "table"} look="soft" onClick={() => setView?.("table")}>
            <Icon remix="RiSortDesc" />
          </Button>
        </Group>
      )}
    </Group>
  );
}
