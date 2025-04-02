import type { Api } from "@core/api/types";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import useChains from "@core/modules/chain/hooks/useChains";
import { useSearchParams } from "react-router";
import { Box, Group, Icon, Select, Space, Text, Title, useWalletContext } from "dappkit";
import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import HistoricalClaimsTableRow from "./HistoricalClaimsRow";
import { HistoricalClaimsTable } from "./HistoricalClaimsTable";

export type HistoricalClaimsLibraryProps = {
  claims: NonNullable<Awaited<ReturnType<ReturnType<Api["v4"]["claims"]>["get"]>>["data"]>;
};

export default function HistoricalClaimsLibrary(props: HistoricalClaimsLibraryProps) {
  const { claims } = props;
  const { chains } = useWalletContext();
  const { options: chainOptions, isSingleChain, indexOptions } = useChains(chains);
  const [_, setSearchParams] = useSearchParams();

  const rows = useMemo(() => {
    return claims?.map(claim => <HistoricalClaimsTableRow key={uuidv4()} claim={claim} />);
  }, [claims]);

  const [chainIdsFilter] = useSearchParamState<string[]>(
    "chain",
    v => v?.join(","),
    v => v?.split(","),
  );

  const updateChains = useCallback((key: string, value: string[], searchParams: URLSearchParams) => {
    if (value?.length === 0 || !value) searchParams.delete(key);
    else searchParams.set(key, value?.join(","));
  }, []);

  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      <HistoricalClaimsTable
        responsive
        dividerClassName={() => "bg-main-6"}
        header={
          <Group className="flex-nowrap items-center">
            <Title h={5} look="soft">
              History
            </Title>
            {!isSingleChain && (
              <Select
                state={[
                  chainIdsFilter,
                  n =>
                    setSearchParams(s => {
                      updateChains("chain", n, s);
                      return s;
                    }),
                ]}
                allOption={"All chains"}
                multiple
                search
                indexOptions={indexOptions}
                options={chainOptions}
                look="base"
                placeholder="Chain"
                placeholderIcon={<Icon remix="RiLink" />}
              />
            )}
          </Group>
        }>
        {rows?.length > 0 ? (
          rows
        ) : (
          <Box className="justify-center items-center">
            <Space size="xl" />
            <Text>No claim transaction found</Text>
            <Space size="xl" />
          </Box>
        )}
      </HistoricalClaimsTable>
    </Group>
  );
}
