import type { Protocol } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";
import Pagination from "../Pagination";
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
        <Group className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-lg md:gap-xl mb-xl w-full justify-center">
          {cells}
        </Group>
        {count !== undefined && <Pagination count={count} />}
      </div>
    </Group>
  );
}
