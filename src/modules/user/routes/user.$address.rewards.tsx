import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  Collapsible,
  Container,
  EventBlocker,
  Fmt,
  Group,
  Icon,
  Space,
  Text,
  mergeClass,
  useWalletContext,
} from "dappkit";
import { useMemo, useState } from "react";
import { isAddress } from "viem";
import merklConfig from "../../../../../../../merkl.config";
import { I18n } from "../../../I18n";
import OpportunityCell from "../../../components/element/opportunity/OpportunityCell";
import ClaimRewardsLibrary from "../../../components/element/rewards/ClaimRewardsLibrary";
import useBalances from "../../../hooks/useBalances";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";
import type { OutletContextRewards } from "./user.$address.header";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";
  const { opportunities } = await OpportunityService.getMany({
    items: 3,
    status: "LIVE",
  });
  return json({ address, opportunities });
}

export default function Index() {
  const { address, opportunities } = useLoaderData<typeof loader>();
  const { rewards: sortedRewards, onClaimSuccess } = useOutletContext<OutletContextRewards>();

  const [isOpen, setIsOpen] = useState(true);

  const { chainId } = useWalletContext();

  const { balances, loading: balanceLoading } = useBalances(chainId);

  const tokenBalance = useMemo(() => {
    if (!balances || balanceLoading) return 0;
    const token = balances?.find(
      balance => balance?.address?.toLowerCase() === merklConfig.dashboard?.reinvestTokenAddress?.toLowerCase(),
    );
    if (!token) return 0;
    return Fmt.toNumber(token?.balance, token?.decimals);
  }, [balances, balanceLoading]);

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

  return (
    <Container>
      <Space size="md" />
      {!!I18n.trad.get.pages.dashboard.reinvest && tokenBalance > 0 && (
        <Group
          className="rounded-md p-md bg-main-5 flex-nowrap items-start flex-col cursor-pointer"
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
          <Collapsible state={[isOpen, setIsOpen]} className={mergeClass("w-full", !isOpen && "hidden")}>
            <Group className="grid grid-cols-1 lg:grid-cols-3 gap-lg*2 w-full">{cells}</Group>
          </Collapsible>
        </Group>
      )}
      <Space size="md" />
      {!!I18n.trad.get.pages.dashboard.explanation && (
        <Group className="rounded-md p-md bg-main-5 flex-nowrap items-start">
          <Icon remix="RiInformation2Fill" className="text-lg text-accent-11 flex-shrink-0" />
          <Text look="bold" size="sm">
            {I18n.trad.get.pages.dashboard.explanation}
          </Text>
        </Group>
      )}
      <Space size="md" />
      <ClaimRewardsLibrary from={address} rewards={sortedRewards} onClaimSuccess={onClaimSuccess} />
    </Container>
  );
}
