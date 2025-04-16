import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Divider, Group, PrimitiveTag, Title, Value } from "dappkit";
import TvlRowAllocation from "./TvlRowAllocation";
import TvlSection from "./TvlSection";

type TvlModalProps = {
  opportunity: Opportunity;
};

export default function TvlModal(props: TvlModalProps) {
  const { opportunity } = props;
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  return (
    <Group className="flex-col">
      <Group className="justify-between items-center">
        <Title look="soft" h={5}>
          TVL INFORMATION
        </Title>
        <PrimitiveTag look="tint" size="lg">
          <Value value format={dollarFormat}>
            {opportunity.tvl ?? 0}
          </Value>
        </PrimitiveTag>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="md">
        <TvlRowAllocation opportunity={opportunity} />
        <TvlSection opportunity={opportunity} />
      </Group>
    </Group>
  );
}
