import type { Opportunity } from "@merkl/api";
import { Collapsible, EventBlocker, Group, Icon, Space, Text, mergeClass } from "dappkit";
import { useEffect, useMemo, useState } from "react";
import { I18n } from "../../../I18n";
import OpportunityCell from "../../../components/element/opportunity/OpportunityCell";
import merklConfig from "../../../config";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";

export default function ReinvestBanner() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!merklConfig.dashboard?.reinvestTokenAddress) return;
    OpportunityService.getMany({
      items: 3,
      status: "LIVE",
    }).then(({ opportunities }) => setOpportunities(opportunities));
  }, []);

  const cells = useMemo(
    () =>
      opportunities?.map(o => (
        <EventBlocker key={`${o.chainId}_${o.type}_${o.identifier}`}>
          <OpportunityCell
            navigationMode={"supply"}
            hideTags={["action", "chain", "status", "token", "tokenChain"]}
            opportunity={o}
          />
        </EventBlocker>
      )),
    [opportunities],
  );

  if (!merklConfig.dashboard?.reinvestTokenAddress) return;
  return (
    <Group
      className="rounded-md p-md bg-main-5 flex-nowrap items-start flex-col cursor-pointer !gap-0"
      onClick={() => setIsOpen(!isOpen)}>
      <Group className="w-full justify-between">
        <Group>
          <Icon coloring={"good"} className={"text-lg text-accent-11"} remix="RiInformation2Fill" />
          <Text look="bold" size="sm">
            {I18n.trad.get.pages.dashboard.reinvest}
          </Text>
        </Group>
        <Icon
          data-state={!isOpen ? "closed" : "opened"}
          className={"transition duration-150 ease-out data-[state=opened]:rotate-180 text-lg text-main-12"}
          remix="RiArrowDownSLine"
        />
      </Group>
      {isOpen && <Space size="md" />}
      <Collapsible state={[isOpen, setIsOpen]} className={mergeClass("w-full")}>
        <Group className="grid grid-cols-1 lg:grid-cols-3 gap-lg*2 w-full">{cells}</Group>
      </Collapsible>
    </Group>
  );
}
