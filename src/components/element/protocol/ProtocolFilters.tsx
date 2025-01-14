import type { Chain } from "@merkl/api";
import { Form } from "@remix-run/react";
import { Icon, Input } from "dappkit";
import { useState } from "react";
import useSearchParamState from "../../../hooks/filtering/useSearchParamState";

const filters = ["search"] as const;
type ProtocolFilter = (typeof filters)[number];

export type ProtocolFilterProps = {
  only?: ProtocolFilter[];
  chains?: Chain[];
  exclude?: ProtocolFilter[];
};

export default function ProtocolFilters(_props: ProtocolFilterProps) {
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
    <Form className="w-full">
      <Input
        name="search"
        size="lg"
        value={innerSearch}
        state={[innerSearch, v => setInnerSearch(v ?? "")]}
        suffix={<Icon size="sm" remix="RiSearchLine" />}
        onClick={onSearchSubmit}
        placeholder="Search a protocol"
        className="w-full"
        look="tint"
      />
    </Form>
  );
}
