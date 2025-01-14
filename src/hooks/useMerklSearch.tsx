import type { Chain, Opportunity, Protocol } from "@merkl/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const searchables = ["opportunity", "protocol", "chain"] as const;
export type Searchable = (typeof searchables)[number];
export type Results = {
  chain: Chain[];
  protocol: Protocol[];
  opportunity: Opportunity[];
};

export function useMerklSearch(input: string, include?: Searchable[]) {
  const [resultCache, setResultCache] = useState<{ [input: string]: Results }>({});
  const results = useMemo(() => resultCache[input], [input, resultCache]);

  const fetchResultsForInput = useCallback(
    (_input: string) => {
      if (!_input || _input?.replaceAll(" ", "") === "") return;

      const fetchers: {
        [S in Searchable]: (i: string) => Promise<Results[S] | null>;
      } = {
        chain: async i => (await api.v4.chains.index.get({ query: { search: i } }))?.data,
        opportunity: async i => (await api.v4.opportunities.index.get({ query: { name: i } }))?.data,
        protocol: async i => (await api.v4.protocols.index.get({ query: { name: i } }))?.data,
      };

      const promises = (include ?? searchables).map(searchable =>
        fetchers[searchable](_input).then(
          res =>
            res?.length &&
            setResultCache(r => ({
              ...r,
              [_input]: {
                ...r[_input],
                [searchable]: res,
              },
            })),
        ),
      );

      return promises;
    },
    [include],
  );

  useEffect(() => {
    fetchResultsForInput(input);
  }, [input, fetchResultsForInput]);

  return results;
}
