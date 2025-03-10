import { api } from "@core/api";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityCell from "@core/modules/opportunity/components/items/OpportunityCell";
import type { Opportunity } from "@merkl/api";
import { Collapsible, EventBlocker, Group, Icon, Space, Text, mergeClass } from "dappkit";
import { useEffect, useMemo, useState } from "react";
import { I18n } from "../../../I18n";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";

export default function ReinvestBanner() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>();
  const [isOpen, setIsOpen] = useState(true);
  const reinvestTokenAddress = useMerklConfig(store => store.config.dashboard?.reinvestTokenAddress);
  const server = useMerklConfig(store => store.config.server);

  useEffect(() => {
    if (!reinvestTokenAddress) return;

    const opportunityService = OpportunityService({ api, server });

    const fetchData = async () => {
      const opp1 = await opportunityService.getMany({
        items: 1,
        sort: "rewards",
        name: "Supply ZK on Venus",
      });

      const opp2 = await opportunityService.getMany({
        items: 1,
        sort: "rewards",
        name: "Supply ZK on ZeroLend",
      });

      const opp3 = await opportunityService.getMany({
        items: 1,
        sort: "rewards",
        name: "Supply ZK on Aave",
      });

      setOpportunities([...opp1.opportunities, ...opp2.opportunities, ...opp3.opportunities]);
    };

    fetchData();
  }, [reinvestTokenAddress, server]);

  const cells = useMemo(
    () =>
      opportunities?.map(o => (
        <EventBlocker key={`${o.chainId}_${o.type}_${o.identifier}`}>
          <OpportunityCell navigationMode={"supply"} tags={[]} opportunity={o} />
        </EventBlocker>
      )),
    [opportunities],
  );

  if (!reinvestTokenAddress) return;
  return (
    <Group
      className="rounded-md p-md bg-main-8 flex-nowrap items-start flex-col cursor-pointer !gap-0"
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
