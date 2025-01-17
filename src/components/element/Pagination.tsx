import { Button, Group, Icon, Select } from "dappkit";
import { useMemo } from "react";
import { DEFAULT_ITEMS_PER_PAGE } from "../../constants/pagination";
import useSearchParamState from "../../hooks/filtering/useSearchParamState";

export type PaginationProps = {
  count?: number;
};

export default function Pagination({ count }: PaginationProps) {
  const [pageFilter, setPageFilter] = useSearchParamState<number>(
    "page",
    v => v.toString(),
    v => Number.parseInt(v),
  );

  const [itemsFilter, setItemsFilter] = useSearchParamState<number>(
    "items",
    v => v.toString(),
    v => Number.parseInt(v),
  );

  const pages = useMemo(() => Math.ceil((count ?? 0) / (itemsFilter ?? DEFAULT_ITEMS_PER_PAGE)), [count, itemsFilter]);
  const pageOptions = useMemo(() => {
    return [...Array(Math.max(Math.round(pages ?? 0), 1)).fill(0)]
      .map((_, index) => index + 1)
      .reduce((obj, index) => Object.assign(obj, { [index]: index }), {});
  }, [pages]);

  return (
    <Group className="justify-between w-full">
      <Group>
        <Select
          state={[itemsFilter ?? DEFAULT_ITEMS_PER_PAGE, setItemsFilter]}
          look="base"
          size="xs"
          options={{ 25: "25", 50: "50", 75: "75", 100: "100" }}
        />
      </Group>
      <Group>
        <Button
          look="base"
          size="xs"
          disabled={(pageFilter ?? 1) <= 1}
          onClick={() => setPageFilter(Math.max(1, (pageFilter ?? 1) - 1))}>
          <Icon remix="RiArrowLeftLine" />
        </Button>
        <Select state={[Math.max(1, pageFilter ?? 1), setPageFilter]} look="base" size="xs" options={pageOptions} />
        <Button
          look="base"
          size="xs"
          disabled={(pageFilter ?? 1) >= pages}
          onClick={() => setPageFilter(Math.min(pages, (pageFilter ?? 1) + 1))}>
          <Icon remix="RiArrowRightLine" />
        </Button>
      </Group>
    </Group>
  );
}
