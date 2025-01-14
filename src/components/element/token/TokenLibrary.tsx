import type { Token } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";
import Pagination from "../opportunity/Pagination";
import TokenFilters from "./TokenFilters";
import { TokenTable } from "./TokenTable";
import TokenTableRow from "./TokenTableRow";

export type TokenLibraryProps = {
  tokens: Token[];
  count?: number;
};

export default function TokenLibrary({ tokens, count }: TokenLibraryProps) {
  const rows = useMemo(
    () => tokens?.map(t => <TokenTableRow key={`${t.name}-${t.chainId}-${t.address}`} token={t} />),
    [tokens],
  );

  return (
    <TokenTable
      footer={count !== undefined && <Pagination count={count} />}
      header={
        <Group className="justify-between w-full">
          <TokenFilters />
        </Group>
      }>
      {rows}
    </TokenTable>
  );
}
