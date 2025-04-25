import type { Opportunity } from "@merkl/api";
import { Button, Icon } from "dappkit";
import { useMemo, useState } from "react";
import { TvlTable } from "./TvlTable";
import TvlTableRow from "./TvlTableRow";

type TvlLibraryProps = {
  opportunity: Opportunity;
};

const DEFAULT_ARRAY_SIZE = 3;

export default function TvlLibrary({ opportunity }: TvlLibraryProps) {
  const [isShowingMore, setIsShowingMore] = useState(false);
  const aprFiltered = useMemo(() => {
    return opportunity.aprRecord.breakdowns.filter(breakdown => breakdown.type === "PROTOCOL");
  }, [opportunity]);

  const tvlFiltered = useMemo(() => {
    return opportunity.tvlRecord.breakdowns
      .filter(breakdown => breakdown.type === "PROTOCOL")
      .sort((a, b) => b.value - a.value)
      .slice(0, isShowingMore ? opportunity.tvlRecord.breakdowns.length : DEFAULT_ARRAY_SIZE);
  }, [opportunity, isShowingMore]);

  const rows = useMemo(
    () =>
      tvlFiltered?.map(breakdown => {
        const aprBreakdown = aprFiltered.find(b => b.identifier === breakdown.identifier);

        return <TvlTableRow key={breakdown.identifier} aprBreakdown={aprBreakdown} tvlBreakdown={breakdown} />;
      }),
    [aprFiltered, tvlFiltered],
  );

  const toggleShowMore = () => setIsShowingMore(prev => !prev);

  if (!rows.length) return null;
  return (
    <TvlTable>
      {rows}
      {rows.length >= DEFAULT_ARRAY_SIZE && (
        <Button className="m-auto" onClick={toggleShowMore}>
          {isShowingMore ? "Less" : "More"}
          <Icon remix={isShowingMore ? "RiArrowUpLine" : "RiArrowDownLine"} />
        </Button>
      )}
    </TvlTable>
  );
}
