import type { Protocol } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";
import Pagination from "../opportunity/Pagination";
import ProtocolCell from "./ProtocolCell";
import ProtocolFilters from "./ProtocolFilters";
export type ProtocolLibraryProps = {
  protocols: Protocol[];
  count: number;
};

export default function ProtocolLibrary({ protocols, count }: ProtocolLibraryProps) {
  const cells = useMemo(() => protocols?.map(p => <ProtocolCell key={`${p.name}`} protocol={p} />), [protocols]);

  return (
    <Group className="flex-col lg:my-xl">
      <Group className="w-full mb-xl">
        <ProtocolFilters />
      </Group>
      <div className="w-full overflow-x-scroll lg:overflow-x-auto">
        <Group className="flex flex-nowrap md:grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-xl mb-xl">
          {cells}
        </Group>
        {count !== undefined && <Pagination count={count} />}
      </div>
    </Group>
  );
}
