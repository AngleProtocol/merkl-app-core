import type { Protocol } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Button, Group, Icon, Image, Text, Title, Value, mergeClass, useOverflowingRef } from "dappkit";
import { useMemo } from "react";
import { ProtocolRow } from "../library/ProtocolTable";
import useProtocolMetadata from "@core/modules/protocol/hooks/useProtocolMetadata";
import merklConfig from "@core/config";

export type ProtocolTableRowProps = {
  protocol: Protocol;
} & BoxProps;

export default function ProtocolTableRow({ protocol, className, ...props }: ProtocolTableRowProps) {
  const { name, link } = useProtocolMetadata(protocol);
  // const { rewardsBreakdown, formattedDailyRewards } = useOpportunityRewards(protocol);

  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const liveCampaignsColumn = useMemo(
    () => (
      <Text bold look="tint" size="lg">
        {/* {protocol.tvl ?? 0} */}
        TODO
      </Text>
    ),
    // [protocol],
    [],
  );

  const rewardsColumn = useMemo(
    () => (
      <Group size="sm">
        <Text look="hype" bold size="lg">
          <Value value format={merklConfig.decimalFormat.dollar}>
            {/* {protocol.dailyRewards ?? 0} */}
            TODO
          </Value>
        </Text>
      </Group>
    ),
    // [protocol, rewardsBreakdown],
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: cannot include props
  const row = useMemo(() => {
    return (
      <ProtocolRow
        size="lg"
        content="sm"
        className={mergeClass("cursor-pointer ease hover:bg-main-2", className)}
        {...props}
        protocolColumn={
          <Group className="flex-col w-full" size="lg">
            <Group className="min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Group className="text-xl items-center">
                <Image className="size-9" src={protocol.icon} alt={protocol.name} />

                <Title
                  h={3}
                  size={4}
                  ref={ref}
                  className={mergeClass(
                    overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                  )}>
                  {name}
                </Title>
              </Group>
            </Group>

            <Group className="items-center">
              test
              {/* TODO: Add tags */}
              {/* <Tags tags={["action"]} size="xs" /> */}
            </Group>
          </Group>
        }
        rewardsColumn={rewardsColumn}
        liveCampaignsColumn={liveCampaignsColumn}
        ctaColumn={
          <Button look="hype">
            <Icon remix="RiArrowRightLine" />
          </Button>
        }
      />
    );
  }, [protocol, className, rewardsColumn, overflowing, ref]);

  return (
    <Link prefetch="intent" to={link}>
      {row}
    </Link>
  );
}
