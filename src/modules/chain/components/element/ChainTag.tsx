import useChain from "@core/modules/chain/hooks/useChain";
import { EventBlocker, Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import { type ReactNode, useCallback } from "react";
import { useNavigate } from "react-router";

export default function ChainTag({
  chain: { id },
  suffix,
  onClick,
  ...props
}: { chain: { id: number }; suffix?: ReactNode } & PrimitiveTagProps) {
  const { chain } = useChain({ id });

  const navigate = useNavigate();
  const navigateToChainPage = useCallback(() => {
    if (!chain) return;
    navigate(`/chains/${chain.name}`);
  }, [chain, navigate]);

  if (!chain) return;
  return (
    <EventBlocker>
      <PrimitiveTag look="base" key={chain.name} {...props} onClick={onClick || navigateToChainPage}>
        <Icon size={props?.size} src={chain?.icon} />
        {chain?.name}
        {suffix}
      </PrimitiveTag>
    </EventBlocker>
  );
}
