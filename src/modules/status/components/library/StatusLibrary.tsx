import type { ChainService } from "@core/modules/chain/chain.service";
import { useMemo } from "react";
import type { StatusService } from "../../status.service";
import StatusTableRow from "../element/StatusTableRow";
import { StatusTable } from "./StatusTable";

export type StatusLibraryProps = {
  data: Awaited<ReturnType<typeof StatusService.getStatusAndDelays>>;
  chains: Awaited<ReturnType<typeof ChainService.getAll>>;
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
