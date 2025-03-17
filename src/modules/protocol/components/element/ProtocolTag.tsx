import type { Protocol } from "@merkl/api";
import { EventBlocker, Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import useProtocolMetadata from "../../hooks/useProtocolMetadata";
import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";

export default function ProtocolTag({ protocol, ...props }: { protocol: Protocol } & PrimitiveTagProps) {
  const { name, icon } = useProtocolMetadata(protocol);

  const navigate = useNavigate();
  const navigateToProtocolPage = useCallback(() => {
    if (!protocol) return;
    navigate(`/protocols/${protocol.name.toLowerCase()}`);
  }, [protocol, navigate]);

  return (
    <EventBlocker>
      <PrimitiveTag look="base" key={protocol?.id} {...props} onClick={navigateToProtocolPage}>
        <Icon src={icon} />
        {name}
      </PrimitiveTag>
    </EventBlocker>
  );
}
