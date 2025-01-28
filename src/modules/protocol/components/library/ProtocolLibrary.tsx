import Pagination from "@core/components/element/Pagination";
import ProtocolFilters from "@core/modules/protocol/components/ProtocolFilters";
import ProtocolCell from "@core/modules/protocol/components/element/ProtocolCell";
import type { Protocol } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";

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
