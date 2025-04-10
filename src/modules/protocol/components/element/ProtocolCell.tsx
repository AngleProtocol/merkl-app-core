import { useMerklConfig } from "@core/modules/config/config.context";
import type { Protocol } from "@merkl/api";
import type { BoxProps } from "dappkit";
import { Box, Divider, Group, Icon, Text, Title, Value, mergeClass, useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import { Link } from "react-router";
import useProtocolMetadata from "../../hooks/useProtocolMetadata";

export type ProtocolCellProps = {
  protocol: Protocol;
} & BoxProps;

export default function ProtocolCell({ protocol }: ProtocolCellProps) {
  const { name, link, tags } = useProtocolMetadata(protocol);
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-1 bg-main-2 ease !gap-0 h-full cursor-pointer !p-0">
        <Group className="p-md md:p-xl flex-1 flex-col">
          <Group className="flex-nowrap items-center">
            <Icon className="size-10" src={protocol.icon} alt={protocol.name} rounded />
            <Title
              h={3}
              size={4}
              ref={ref}
              className={mergeClass(
                "[overflow-wrap:anywhere]",
                overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
              )}>
              {name}
            </Title>
          </Group>
          <Group className="justify-between flex-nowrap">
            <Group className="items-center">{tags}</Group>
          </Group>
        </Group>
        <Divider className="my-0" look="soft" />
        <div className="p-md md:p-xl">
          <Group className="flex-nowrap items-center" size="sm">
            <Text bold look="soft" className="flex gap-sm">
              <Value className="text-right font-bold" look={"soft"} format={dollarFormat}>
                {protocol.dailyRewards}
              </Value>
              Daily Rewards
            </Text>
          </Group>
          <Text look="base">{protocol.numberOfLiveCampaigns} Campaigns</Text>
        </div>
      </Box>
    ),
    [
      protocol.icon,
      protocol.name,
      overflowing,
      ref,
      protocol.dailyRewards,
      protocol.numberOfLiveCampaigns,
      tags,
      name,
      dollarFormat,
    ],
  );

  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
