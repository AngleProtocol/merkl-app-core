import ChainTableRow from "@core/modules/chain/components/element/ChainTableRow";
import { ChainTable } from "@core/modules/chain/components/library/ChainTable";
import type { Chain } from "@merkl/api";
import { useMemo } from "react";

export type ChainLibraryProps = {
  chains: Chain[];
  count?: number;
};

export default function ChainLibrary({ chains }: ChainLibraryProps) {
  const rows = useMemo(() => chains?.map(c => <ChainTableRow key={`${c.id}`} chain={c} />), [chains]);

  return <ChainTable>{rows}</ChainTable>;
}
