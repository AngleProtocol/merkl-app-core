import type { Chain } from "@merkl/api";
import { Divider, Dropdown, Group, PrimitiveTag, Value } from "dappkit";
import { type ReactNode, useMemo } from "react";
import User from "../../../../components/element/user/User";

export type AddressListRuleProps = {
  value: { label: ReactNode; addresses: string[]; description: string; chain: Chain };
};

export default function AddressListRule({
  value: { label, addresses, description, chain },
  ...props
}: AddressListRuleProps) {
  const listedAddresses = useMemo(
    () => addresses.map(a => <User chain={chain} address={a} key={a} />),
    [addresses, chain],
  );
  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={
        <Group className="flex-col max-w-[42ch]">
          <Group className="flex-col">{description}</Group>
          <Divider horizontal look="soft" />
          <Group className="">{listedAddresses}</Group>
        </Group>
      }>
      <PrimitiveTag look="soft" {...props}>
        {label}
        <Value format="0" {...props}>
          {addresses?.length}
        </Value>
      </PrimitiveTag>
    </Dropdown>
  );
}
