import type { Protocol } from "@merkl/api";
import type { TagTypes } from "@core/components/element/Tag";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Box, Divider, Group, Image, Text, Title, mergeClass, useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import useProtocolMetadata from "../../hooks/useProtocolMetadata";

export type ProtocolCellProps = {
  protocol: Protocol;
  tags?: (keyof TagTypes)[];
} & BoxProps;

export default function ProtocolCell({ protocol, tags }: ProtocolCellProps) {
  const { name, link } = useProtocolMetadata(protocol);

  // const { formattedDailyRewards } = useOpportunityRewards(protocol);
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-1 bg-main-2 ease !gap-0 h-full cursor-pointer !p-0">
        <Group className="p-md md:p-xl justify-between flex-1 items-end">
          <Group className="flex-nowrap items-center">
            <Image className="size-10" src={protocol.icon} alt={protocol.name} />
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
            {/* TODO: Provide Tags */}
            <Group className="items-center">{/* <Tags tags={tags ?? ["action"]} size="xs" /> */}</Group>
          </Group>
        </Group>
        <Divider className="my-0" look="soft" />
        <div className="p-md md:p-xl">
          <Group className="flex-nowrap items-center" size="sm">
            {/* TODO: Provide DailyRewards */}
            {/* <Group className="min-w-0 flex-nowrap items-center overflow-hidden">{formattedDailyRewards}</Group> */}
            <Text bold look="soft">
              Daily Rewards
            </Text>
          </Group>
          <Text look="base">
            {/* TODO: Add the number of campaigns */}
            Campaigns
          </Text>
        </div>
      </Box>
    ),
    [protocol.icon, protocol.name, name, overflowing, ref],
  );

  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
