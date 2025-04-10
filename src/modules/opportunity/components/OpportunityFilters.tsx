import type { OpportunityView } from "@core/config/opportunity";
import useChains from "@core/modules/chain/hooks/useChains";
import { useConfigContext, useMerklConfig } from "@core/modules/config/config.context";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import useProtocols from "@core/modules/protocol/hooks/useProtocols";
import type { Chain } from "@merkl/api";
import { Button, Group, Icon, Input, Select } from "dappkit";
import { useMemo } from "react";
import useOpportunityFilters from "../hooks/useOpportunityFilters";
const filters = ["search", "action", "status", "chain", "protocol", "sort", "tvl"] as const;
export type OpportunityFilter = (typeof filters)[number];

export type OpportunityFilterProps = {
  only?: OpportunityFilter[];
  chains?: Chain[];
  setView?: (v: OpportunityView) => void;
  exclude?: OpportunityFilter[];
};

// TODO reimplement MIXPANEL
export default function OpportunityFilters({
  only, // Only these filters
  exclude, // Exclude these filters
  chains,
}: OpportunityFilterProps) {
  const {
    options: chainOptions,
    searchOptions: chainSearchOptions,
    indexOptions: chainIndexOptions,
    isSingleChain,
  } = useChains(chains);

  const { useStore } = useConfigContext();

  const { options: protocolOptions } = useProtocols(useStore.getState().protocols);
  const isSingleProtocol = useMemo(() => !(useStore.getState().protocols.length > 1), [useStore]);

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

  const { track } = useMixpanelTracking();

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
            onClick={() => track("Click on button", { button: "search", type: "searchbar" })}
            onKeyDown={e => {
              if (e.key !== "Enter") return;
              track("Click on button", {
                button: "search",
                type: "searchbar",
                search: filtersState.searchFilter.input,
              });
              filtersState.searchFilter.executeSearch();
            }}
            suffix={
              <Icon
                remix="RiSearchLine"
                className="cursor-pointer hover:text-main-12"
                onClick={() => {
                  track("Click on button", {
                    button: "search",
                    type: "searchbar",
                    search: filtersState.searchFilter.input,
                  });
                  filtersState.searchFilter.executeSearch();
                }}
              />
            }
            placeholder="Search"
          />
        )}
        {fields.includes("action") && (
          <Select
            state={[
              filtersState.actionsFilter.input ?? [],
              (ids: string[]) => {
                filtersState.actionsFilter.setInput(ids);
                track("Click on button", { button: "category", type: "searchbar", actions: ids });
              },
            ]}
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
            state={[
              filtersState.statusFilter.input ?? [],
              (ids: string[]) => {
                filtersState.statusFilter.setInput(ids);
                track("Click on button", { button: "status", type: "searchbar", statuses: ids });
              },
            ]}
            multiple
            options={filtersState.statusFilter.options}
            look="tint"
            placeholder="Status"
            placeholderIcon={<Icon remix="RiCheckboxCircleFill" />}
          />
        )}
        {fields.includes("chain") && !isSingleChain && (
          <Select
            state={[
              filtersState.chainIdsFilter.input ?? [],
              (ids: string[]) => {
                filtersState.chainIdsFilter.setInput(ids);
                track("Click on button", {
                  button: "chain",
                  type: "searchbar",
                  chains: ids?.map(id => chains?.find(c => c.id === +id)?.name),
                });
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
        )}
        {fields.includes("protocol") && !isSingleProtocol && (
          <Select
            state={[
              filtersState.protocolsFilter.input ?? [],
              (ids: string[]) => {
                filtersState.protocolsFilter.setInput(ids);
                track("Click on button", { button: "protocol", type: "searchbar", protocols: ids });
              },
            ]}
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
          <Icon remix="RiCloseLine" />
        </Button>
      </Group>
      {fields.includes("sort") && (
        <Select
          state={[
            filtersState.sortFilter.input,
            (ids: string) => {
              //biome-ignore lint/suspicious/noExplicitAny: no reasons for it to have type errors
              filtersState.sortFilter.setInput(ids as any);
              // biome-ignore lint/suspicious/noExplicitAny: no reasons for it to have type errors
              track("Click on button", { button: "sorting", type: "searchbar", sorting: ids as any });
            },
          ]}
          options={filtersState.sortFilter.options}
          look="hype"
          placeholder={defaultSortPlaceholder}
        />
      )}
    </Group>
  );
}
