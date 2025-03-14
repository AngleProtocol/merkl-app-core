import type { Api } from "@core/api/types";
import type { Chain } from "@merkl/api";
import { useMemo } from "react";
import DelayTableRow from "../element/DelayTableRow";
import { DelayTable } from "./DelayTable";

export type DelayLibraryProps = {
  delays: NonNullable<
    Awaited<ReturnType<Api["v4"]["campaign-status"]["delay"]["status"]["get"]>>["data"]
  >[0]["delayed"];
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
