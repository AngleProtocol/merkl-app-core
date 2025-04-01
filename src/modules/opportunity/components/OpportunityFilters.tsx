import type { OpportunityView } from "@core/config/opportunity";
import useChains from "@core/modules/chain/hooks/useChains";
import { useMerklConfig } from "@core/modules/config/config.context";
import useProtocols from "@core/modules/protocol/hooks/useProtocols";
import type { Chain, Protocol } from "@merkl/api";
import { Button, Group, Icon, Input, Select } from "dappkit";
import { useMemo } from "react";
import useOpportunityFilters from "../hooks/useOpportunityFilters";
const filters = ["search", "action", "status", "chain", "protocol", "sort", "tvl"] as const;
export type OpportunityFilter = (typeof filters)[number];

export type OpportunityFilterProps = {
  only?: OpportunityFilter[];
  chains?: Chain[];
  setView?: (v: OpportunityView) => void;
  protocols?: Protocol[];
  exclude?: OpportunityFilter[];
};

// TODO reimplement MIXPANEL
export default function OpportunityFilters({
  only, // Only these filters
  exclude, // Exclude these filters
  chains,
  protocols,
}: OpportunityFilterProps) {
  const { options: protocolOptions, isSingleProtocol } = useProtocols(protocols);

  const {
    options: chainOptions,
    searchOptions: chainSearchOptions,
    indexOptions: chainIndexOptions,
    isSingleChain,
  } = useChains(chains);

  const filtersConfigEnabled = useMerklConfig(store => store.config.opportunitiesFilters);
  const defaultSortBy = useMerklConfig(store => store.config.backend.sortedBy);

  const { filtersState, clearFilters } = useOpportunityFilters();

  const defaultSortPlaceholder = useMemo(
    () => filtersConfigEnabled?.[defaultSortBy.concat("-desc")].name,
    [defaultSortBy, filtersConfigEnabled],
  );

  const fields = useMemo(() => {
    if (only) return filters.filter(f => only.includes(f));
    if (exclude) return filters.filter(f => !exclude.includes(f));
    return filters;
  }, [only, exclude]);

  return (
    <Group className="justify-between flex-nowrap overflow-x-scroll">
      <Group className="items-center flex-nowrap">
        {fields.includes("search") && (
          <Input
            look="base"
            name="search"
            value={filtersState.searchFilter.input ?? ""}
            className="min-w-[12ch]"
            state={[filtersState.searchFilter.input ?? "", filtersState.searchFilter.setInput]}
            suffix={<Icon remix="RiSearchLine" />}
            placeholder="Search"
          />
        )}
        {fields.includes("action") && (
          <Select
            state={[filtersState.actionsFilter.input, filtersState.actionsFilter.setInput]}
            allOption={"All categories"}
            multiple
            options={filtersState.actionsFilter.options}
            look="tint"
            placeholder="Category"
            placeholderIcon={<Icon remix="RiLayoutMasonryFill" />}
          />
        )}
        {fields.includes("status") && (
          <Select
            state={[filtersState.statusFilter.input, filtersState.statusFilter.setInput]}
            multiple
            options={filtersState.statusFilter.options}
            look="tint"
            placeholder="Status"
            placeholderIcon={<Icon remix="RiCheckboxCircleFill" />}
          />
        )}
        {fields.includes("chain") && !isSingleChain && (
          <Select
            state={[filtersState.chainIdsFilter.input, filtersState.chainIdsFilter.setInput]}
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
            state={[filtersState.protocolsFilter.input, filtersState.protocolsFilter.setInput]}
            allOption={"All protocols"}
            multiple
            search
            options={protocolOptions}
            look="tint"
            placeholder="Protocol"
            placeholderIcon={<Icon remix="RiShapesFill" />}
          />
        )}
        <Button onClick={clearFilters} look="soft" size="xs" className="text-nowrap">
          Clear all filters
          <Icon remix="RiCloseLine" />{" "}
        </Button>
      </Group>
      {fields.includes("sort") && (
        <Select
          state={[filtersState.sortFilter.input, filtersState.sortFilter.setInput]}
          options={filtersState.sortFilter.options}
          look="hype"
          placeholder={defaultSortPlaceholder}
        />
      )}
    </Group>
  );
}
