import Pagination from "@core/components/element/Pagination";
import TokenFilters from "@core/modules/token/components/TokenFilters";
import TokenTableRow from "@core/modules/token/components/element/TokenTableRow";
import { TokenTable } from "@core/modules/token/components/library/TokenTable";
import type { Token } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";

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
