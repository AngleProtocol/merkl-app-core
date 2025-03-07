import Tag from "@core/components/element/Tag";
import merklConfig from "@core/config";
import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Text, Value } from "packages/dappkit/src";

type IProps = {
  opportunity: Opportunity;
};

export default function OpportunityBoxParticipate(props: IProps) {
  const { opportunity } = props;

  return (
    <Group className="w-full !gap-0 h-[fit-content] border-1 rounded-lg border-accent-5 overflow-hidden">
      <Group className="justify-between flex-nowrap h-[fit-content] bg-main-2 p-xl w-full">
        <Text>{"Opportunity".toUpperCase()}</Text>
        <Tag type="status" value={opportunity.status} size="xs" />
      </Group>

      <Group className="bg-accent-4 p-xl w-full justify-between flex-nowrap items-end">
        <Group className="flex-col">
          <Text bold className="flex items-center gap-sm ">
            <Icon remix="RiStarFill" className="fill-accent-10" />
            DAILY REWARDS
          </Text>
          <Text bold look="tint" size={"xl"}>
            <Value value format={merklConfig.decimalFormat.dollar}>
              {opportunity.dailyRewards}
            </Value>
          </Text>
        </Group>
        <Button look="hype" className="h-[fit-content]">
          Supply <Icon remix="RiArrowRightUpLine" />
        </Button>
      </Group>

      <Group className="bg-main-2 p-xl h-[fit-content] w-full justify-between flex-col gap-xl">
        <Group className="justify-between flex-nowrap">
          <Text> DETAILS </Text>
          <Group>
            <Tag type="chain" value={opportunity.chain} size="xs" />
            <Tag type="protocol" value={opportunity.protocol} size="xs" />
          </Group>
        </Group>
        <Group>
          <Group className="border-1 border-accent-10 p-xl flex-col flex-1">
            <Text bold className="flex items-center gap-sm ">
              APR
            </Text>
            <Text bold look="tint" size={"xl"}>
              <Value value format={merklConfig.decimalFormat.apr}>
                {opportunity.apr / 100}
              </Value>
            </Text>
          </Group>
          <Group className="border-1 border-accent-10 p-xl flex-col flex-1">
            <Text bold className="flex items-center gap-sm ">
              TVL
            </Text>
            <Text bold look="tint" size={"xl"}>
              <Value value format={merklConfig.decimalFormat.dollar}>
                {opportunity.tvl}
              </Value>
            </Text>
          </Group>
        </Group>
      </Group>
    </Group>
  );
}
