import Safe from "@core/assets/images/SAFE.png";
import type { Chain } from "@merkl/api";
import {
  type BoxProps,
  Button,
  Collapsible,
  Copy,
  Group,
  Hash,
  Icon,
  Space,
  Text,
  Time,
  Tooltip,
  mergeClass,
} from "dappkit";

import type { Api } from "@core/api/types";
import { useState } from "react";
import DelayLibrary from "../library/DelayLibrary";
import { StatusRow } from "../library/StatusTable";

export type StatusTableRowProps = {
  status: NonNullable<Awaited<ReturnType<Api["v4"]["campaign-status"]["delay"]["status"]["get"]>>["data"]>[1];
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
      }
      updateColumn={
        <Group>
          <Tooltip
            icon={false}
            helper={<>Open the report containing all changes pushed in the last Merkle Tree root update</>}>
            <Button
              to={`https://storage.cloud.google.com/merkl-production-reports/${chain.id}/${status.lastTree}_${status.tree}.html`}
              external
              look="soft">
              <Icon remix="RiFileChart2Fill" />
            </Button>
          </Tooltip>
          <Time timestamp={status.endOfDisputePeriod * 1000} prefix="In " />
        </Group>
      }
      treeColumn={
        <Group className="items-center">
          <Tooltip icon={false} helper={<>Copy the root of the last tree pushed on the Distributor smart contract</>}>
            <Copy value={status.tree} />
          </Tooltip>
          <Hash format="prefix">{status.tree}</Hash>
        </Group>
      }
      lastTreeColumn={
        <Group className="items-center">
          <Tooltip
            icon={false}
            helper={<>Copy the root of the second last tree pushed on the Distributor smart contract</>}>
            <Copy value={status.lastTree} />
          </Tooltip>
          <Hash format="prefix">{status.lastTree}</Hash>
        </Group>
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
                <Icon size={props?.size} remix="RiArrowRightUpLine" />
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
                <Icon size={props?.size} remix="RiArrowRightUpLine" />
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
                <Icon size={props?.size} remix="RiArrowRightUpLine" />
              </Button>
              <Copy value={status.admin} />
              <Button key={status.adminUrl} to={status.adminUrl} external size="xs" look="soft">
                <Icon src={Safe} />
              </Button>
            </Group>
          )}
        </Group>
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />

        <DelayLibrary chain={chain} delays={status.delayed} />
      </Collapsible>
    </StatusRow>
  );
}
