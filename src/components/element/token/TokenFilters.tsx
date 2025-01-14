import type { Chain } from "@merkl/api";
import { Form } from "@remix-run/react";
import { Group, Icon, Input } from "dappkit";
import { useState } from "react";
import useSearchParamState from "../../../hooks/filtering/useSearchParamState";

const filters = ["search"] as const;
type ProtocolFilter = (typeof filters)[number];

export type TokenFiltersProps = {
  only?: ProtocolFilter[];
  chains?: Chain[];
  exclude?: ProtocolFilter[];
};

export default function TokenFilters(_props: TokenFiltersProps) {
  const [search, setSearch] = useSearchParamState<string>(
    "search",
    v => v,
    v => v,
  );
  const [innerSearch, setInnerSearch] = useState<string>(search ?? "");

  function onSearchSubmit() {
    if (!innerSearch || innerSearch === search) return;

    setSearch(innerSearch);
  }

  return (
    <Group>
      <Form>
        <Input
          name="search"
          value={innerSearch}
          state={[innerSearch, setInnerSearch]}
          suffix={<Icon size="sm" remix="RiSearchLine" />}
          onClick={onSearchSubmit}
          placeholder="Search"
        />
      </Form>
    </Group>
  );
}
