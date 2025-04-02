import { actions } from "@core/config/actions";
import type { OpportunityView } from "@core/config/opportunity";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import { Form, useLocation, useNavigate, useNavigation, useSearchParams } from "react-router";
import { Button, Group, Icon, Input, Select } from "dappkit";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
const filters = ["search", "action", "status", "chain", "protocol", "sort", "tvl"] as const;
export type ProtocolFilter = (typeof filters)[number];

export type ProtocolFilterProps = {
  only?: ProtocolFilter[];
  setView?: (v: OpportunityView) => void;
  exclude?: ProtocolFilter[];
  onClear?: () => void;
  clearing?: boolean;
};

//TODO: burn this to the ground and rebuild it with a deeper comprehension of search param states
export default function ProtocolFilter({ only, exclude, onClear, clearing }: ProtocolFilterProps) {
  const [_, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [applying, setApplying] = useState(false);

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
    "rewards-asc": (
      <Group className="flex-nowrap !gap-sm">
        By Daily Rewards
        <Icon remix="RiArrowUpLine" />
      </Group>
    ),
    "rewards-desc": (
      <Group className="flex-nowrap !gap-sm">
        By Daily Rewards
        <Icon remix="RiArrowDownLine" />
      </Group>
    ),
    "campaigns-asc": (
      <Group className="flex-nowrap !gap-sm">
        By Live Campaigns
        <Icon remix="RiArrowUpLine" />
      </Group>
    ),
    "campaigns-desc": (
      <Group className="flex-nowrap !gap-sm">
        By Live Campaigns
        <Icon remix="RiArrowDownLine" />
      </Group>
    ),
  };

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

  const [search, setSearch] = useSearchParamState<string>(
    "search",
    v => v,
    v => v,
  );

  const [innerSearch, setInnerSearch] = useState<string>(search ?? "");

  const fields = useMemo(() => {
    if (only) return filters.filter(f => only.includes(f));
    if (exclude) return filters.filter(f => !exclude.includes(f));
    return filters;
  }, [only, exclude]);

  function onSearchSubmit() {
    if (innerSearch === search) return;
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

    const sameActions = isSameArray(actionsInput, actionsFilter);
    const sameSearch = (search ?? "") === innerSearch;

    return [sameActions, sameSearch].some(v => v === false);
  }, [actionsInput, actionsFilter, search, innerSearch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: needed fo sync
  useEffect(() => {
    setActionsInput(actionsFilter ?? []);
  }, [location.search]);

  function onApplyFilters() {
    setApplying(true);
    setSearchParams(params => {
      updateParams("action", actionsInput, params);
      return params;
    });
    onSearchSubmit();
  }

  function onClearFilters() {
    setApplying(false);

    navigate(location.pathname, { replace: true });

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
      setActionsInput([]);
      setInnerSearch("");
      setSortInput("");
      onClear?.();
    }
  }, [clearing, onClear]);

  const onSortByChange = useCallback(
    (sort: FormEvent<HTMLDivElement>) => {
      setSearchParams(params => {
        updateParams("sort", [sort.toString()], params);
        return params;
      });
    },
    [updateParams, setSearchParams],
  );

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
              state={[innerSearch, v => setInnerSearch(v ?? "")]}
              suffix={<Icon remix="RiSearchLine" />}
              onClick={onSearchSubmit}
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
        options={sortOptions}
        look="hype"
        placeholder={"By Daily Rewards"}
      />
    </Group>
  );
}
