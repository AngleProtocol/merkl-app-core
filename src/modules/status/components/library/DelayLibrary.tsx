import type { Chain } from "@merkl/api";
import { useMemo } from "react";
import type { StatusService } from "../../status.service";
import DelayTableRow from "../element/DelayTableRow";
import { DelayTable } from "./DelayTable";

export type DelayLibraryProps = {
  delays: Awaited<ReturnType<typeof StatusService.getStatusAndDelays>>[number]["delayed"];
  chain: Chain;
};

export default function DelayLibrary({ delays, chain }: DelayLibraryProps) {
  const rows = useMemo(
    () =>
      delays
        ?.sort((a, b) => (a.delay < b.delay ? 1 : -1))
        ?.map(row => {
          return <DelayTableRow key={`${chain.id}`} chain={chain} delay={row} />;
        }),
    [delays, chain],
  );

  return (
    <DelayTable dividerClassName={() => "!bg-main-8"} className="[&>*]:bg-main-4" look="soft">
      {rows}
    </DelayTable>
  );
}
