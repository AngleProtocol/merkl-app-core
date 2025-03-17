import type { Opportunity } from "@merkl/api";
import { Divider, Group, PrimitiveTag, Title, Value } from "dappkit";
import TvlRowAllocation from "../tvl/TvlRowAllocation";
import TvlSection from "../tvl/TvlSection";
import AprSection from "./AprSection";
import { useMerklConfig } from "@core/modules/config/config.context";

type AprModalProps = {
  opportunity: Opportunity;
};

export default function AprModal(props: AprModalProps) {
  const { opportunity } = props;

  const aprFormat = useMerklConfig(store => store.config.decimalFormat.apr);

  return (
    <Group className="flex-col -my-md">
      <Group className="justify-between items-center">
        <Title look="soft" h={5}>
          AVERAGE APR
        </Title>
        <PrimitiveTag look="tint" size="lg">
          <Value value format={aprFormat}>
            {opportunity.apr / 100}
          </Value>
        </PrimitiveTag>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="lg">
        <TvlRowAllocation opportunity={opportunity} />
        <AprSection opportunity={opportunity} />
        <TvlSection opportunity={opportunity} />
      </Group>
    </Group>
  );
}
