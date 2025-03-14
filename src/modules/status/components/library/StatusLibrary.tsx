import type { Api } from "@core/api/types";
import type { Chain } from "@merkl/api";
import { useMemo } from "react";
import StatusTableRow from "../element/StatusTableRow";
import { StatusTable } from "./StatusTable";

export type StatusLibraryProps = {
  data: NonNullable<Awaited<ReturnType<Api["v4"]["campaign-status"]["delay"]["status"]["get"]>>["data"]>;
  chains: Chain[];
  hideChainWithoutLiveCampaigns?: boolean;
};

export default function StatusLibrary({ data, chains, hideChainWithoutLiveCampaigns }: StatusLibraryProps) {
  const rows = useMemo(
    () =>
      chains
        ?.sort((a, b) => (a.name > b.name ? 1 : -1))
        ?.filter(chain => !!data[chain.id])
        ?.filter(chain => !hideChainWithoutLiveCampaigns || data[chain.id].liveCampaigns > 0)
        ?.map(chain => {
          return <StatusTableRow key={`${chain.id}`} chain={chain} status={data[chain.id]} />;
        }),
    [chains, data, hideChainWithoutLiveCampaigns],
  );

  return <StatusTable>{rows}</StatusTable>;
}
