import { Group, Text, Title } from "dappkit";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ClaimsService } from "../../../modules/claim/claim.service";
import HistoricalClaimsTableRow from "./HistoricalClaimsRow";
import { HistoricalClaimsTable } from "./HistoricalClaimsTable";

export type HistoricalClaimsLibraryProps = {
  claims: Awaited<ReturnType<typeof ClaimsService.getForUser>>;
};

export default function HistoricalClaimsLibrary(props: HistoricalClaimsLibraryProps) {
  const { claims } = props;
  // const { chains } = useWalletContext();
  // const { options: chainOptions, isSingleChain } = useChains(chains);

  const rows = useMemo(() => {
    return claims?.map(claim => <HistoricalClaimsTableRow key={uuidv4()} claim={claim} />);
  }, [claims]);

  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      {rows?.length > 0 ? (
        <HistoricalClaimsTable
          responsive
          dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
          header={
            <Group className="flex-nowrap items-center">
              <Title h={5} look="soft">
                History
              </Title>
              {/* <Select
                // state={[chainIdsInput, n => setChainIdsInput(n)]}
                allOption={"All chains"}
                multiple
                search
                options={chainOptions}
                look="base"
                placeholder="Chain"
                placeholderIcon={<Icon remix="RiLink" />}
              /> */}
            </Group>
          }>
          {rows}
        </HistoricalClaimsTable>
      ) : (
        <Text>No claim transaction found</Text>
      )}
    </Group>
  );
}
