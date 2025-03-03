import Safe from "@core/assets/images/SAFE.png";
import EtherScan from "@core/assets/images/etherscan.svg";
import type { Chain } from "@merkl/api";
import {
  type BoxProps,
  Button,
  Collapsible,
  Copy,
  Group,
  Hash,
  Icon,
  Image,
  Space,
  Text,
  Time,
  mergeClass,
} from "dappkit";

import { useState } from "react";
import type { StatusService } from "../../status.service";
import DelayLibrary from "../library/DelayLibrary";
import { StatusRow } from "../library/StatusTable";

export type StatusTableRowProps = {
  status: Awaited<ReturnType<typeof StatusService.getStatusAndDelays>>[1];
  chain: Chain;
} & BoxProps;

export default function StatusTableRow({ status, chain, className, ...props }: StatusTableRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <StatusRow
      size="lg"
      content="sm"
      className={mergeClass("", className)}
      {...props}
      statusColumn={
        status.disputer === "0x0000000000000000000000000000000000000000" ? (
          <Icon color="green" remix="RiCheckboxCircleFill" />
        ) : (
          <Icon color="red" remix="RiErrorWarningFill" />
        )
      }
      chainColumn={
        <Group>
          <Icon src={chain?.icon} />
          <Text look="bold" size="md" bold>
            {chain?.name}
          </Text>
        </Group>
      }
      updateColumn={
        <Group>
          <Time timestamp={status.endOfDisputePeriod * 1000} />
          <Button
            to={`https://storage.cloud.google.com/merkl-production-reports/${chain.id}/${status.lastTree}_${status.tree}.html`}
            external
            look="soft">
            <Icon remix="RiFileChart2Fill" />
          </Button>
        </Group>
      }
      treeColumn={
        <Hash format="short" copy>
          {status.tree}
        </Hash>
      }
      lastTreeColumn={
        <Hash format="short" copy>
          {status.lastTree}
        </Hash>
      }
      contractsColumn={
        <Group className="py-md w-full">
          {!!status.distributor && (
            <Group className="text-nowrap whitespace-nowrap text-ellipsis">
              <Button
                key={`${chain.explorers?.[0]?.url}`}
                to={`${chain.explorers?.[0]?.url}/address/${status.distributor}`}
                external
                look="soft">
                Distributor
                <Image className="w-3" src={EtherScan} />
              </Button>
              <Copy value={status.distributor} />
            </Group>
          )}
          {!!status.distributionCreator && (
            <Group className="text-nowrap whitespace-nowrap text-ellipsis">
              <Button
                key={`${chain.explorers?.[0]?.url}`}
                to={`${chain.explorers?.[0]?.url}/address/${status.distributionCreator}`}
                external
                look="soft">
                Creator
                <Image className="w-3" src={EtherScan} />
              </Button>
              <Copy value={status.distributionCreator} />
            </Group>
          )}
          {!!status.admin && (
            <Group className="text-nowrap whitespace-nowrap text-ellipsis">
              <Button
                key={`${chain.explorers?.[0]?.url}`}
                to={`${chain.explorers?.[0]?.url}/address/${status.admin}`}
                external
                look="soft">
                Admin
                <Image className="w-3" src={EtherScan} />
              </Button>
              <Copy value={status.admin} />
              <Button key={status.adminUrl} to={status.adminUrl} external size="xs" look="soft">
                <Icon src={Safe} />
              </Button>
            </Group>
          )}
        </Group>
      }
      liveColumn={<Text look="bold">{status.liveCampaigns}</Text>}
      delayColumn={
        <Button
          size="xs"
          look="soft"
          disabled={status.delayed.length === 0}
          onClick={() => {
            if (status.delayed.length > 0) setOpen(o => !o);
          }}>
          <Text look="bold">{status.delayed.length}</Text>
          {status.delayed.length > 0 && (
            <Icon
              data-state={!open ? "closed" : "opened"}
              className=" data-[state=opened]:rotate-180"
              remix={"RiArrowDropDownLine"}
            />
          )}
        </Button>
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />

        <DelayLibrary chain={chain} delays={status.delayed} />
      </Collapsible>
    </StatusRow>
  );
}
