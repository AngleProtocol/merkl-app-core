import { Box, Group, Icon, Select, Space, Text, Title, useWalletContext } from "dappkit";
import { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ClaimsService } from "../../../modules/claim/claim.service";
import HistoricalClaimsTableRow from "./HistoricalClaimsRow";
import { HistoricalClaimsTable } from "./HistoricalClaimsTable";
import useChains from "@core/modules/chain/hooks/useChains";
import useSearchParamState from "@core/hooks/filtering/useSearchParamState";
import { useSearchParams } from "@remix-run/react";

export type HistoricalClaimsLibraryProps = {
  claims: Awaited<ReturnType<typeof ClaimsService.getForUser>>;
};

export default function HistoricalClaimsLibrary(props: HistoricalClaimsLibraryProps) {
  const { claims } = props;
  const { chains } = useWalletContext();
  const { options: chainOptions, isSingleChain } = useChains(chains);
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
        dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
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
