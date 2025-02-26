import type { Protocol } from "@merkl/api";
import { Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import useProtocolMetadata from "../../hooks/useProtocolMetadata";

export default function ProtocolTag({ protocol, ...props }: { protocol: Protocol } & PrimitiveTagProps) {
  const { name, icon } = useProtocolMetadata(protocol);

  return (
    <PrimitiveTag look="base" key={protocol?.id} {...props}>
      <Icon src={icon} />
      {name}
    </PrimitiveTag>
  );
}
