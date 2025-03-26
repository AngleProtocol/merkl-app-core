import type { Opportunity } from "@merkl/api";
import { Divider, Group, PrimitiveTag, Title } from "dappkit";
import TvlRowAllocation from "../tvl/TvlRowAllocation";
import TvlSection from "../tvl/TvlSection";
import AprSection from "./AprSection";
import AprValue from "./AprValue";

type AprModalProps = {
  opportunity: Opportunity;
};

export default function AprModal(props: AprModalProps) {
  const { opportunity } = props;

  return (
    <Group className="flex-col">
      <Group className="justify-between items-center">
        <Title look="soft" h={5}>
          AVERAGE APR
        </Title>
        <PrimitiveTag look="tint" size="lg">
          <AprValue value>{opportunity.apr}</AprValue>
        </PrimitiveTag>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="md">
        <TvlRowAllocation opportunity={opportunity} />
        <AprSection opportunity={opportunity} />
        <TvlSection opportunity={opportunity} />
      </Group>
    </Group>
  );
}
