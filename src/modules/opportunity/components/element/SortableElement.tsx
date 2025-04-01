import { useMemo } from "react";
import useOpportunityFilters, { SortOrder } from "../../hooks/useOpportunityFilters";
import { Group, Icon, Text } from "packages/dappkit/src";

type SortableElementProps = {
  label: React.ReactNode;
  sortingKey: string;
  initialSortOrder?: SortOrder;
};

export default function SortableElement(props: SortableElementProps) {
  const { label, sortingKey, initialSortOrder } = props;

  const { filtersState, toggleSortOrder } = useOpportunityFilters();

  const [sortBase, sortOrder] = filtersState.sortFilter.input.split("-");

  const remixIcon = useMemo(() => {
    if (sortBase !== sortingKey) return "RiArrowDownLine";
    if (sortOrder === SortOrder.DESC) return "RiArrowDownLine";
    return "RiArrowUpLine";
  }, [sortOrder, sortBase, sortingKey]);

  return (
    <Group onClick={() => toggleSortOrder(sortingKey, initialSortOrder)} className="cursor-pointer group" size="sm">
      <Text>{label}</Text>
      <Icon remix={remixIcon} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </Group>
  );
}
