import useChain from "@core/modules/chain/hooks/useChain";
import { useNavigate } from "@remix-run/react";
import { EventBlocker, Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import { useCallback } from "react";

export default function ChainTag({ chain: { id }, ...props }: { chain: { id: number } } & PrimitiveTagProps) {
  const { chain } = useChain({ id });

  const navigate = useNavigate();
  const navigateToChainPage = useCallback(() => {
    if (!chain) return;
    navigate(`/chains/${chain.name}`);
  }, [chain, navigate]);

  if (!chain) return;
  return (
    <EventBlocker>
      <PrimitiveTag look="base" key={chain.name} {...props} onClick={navigateToChainPage}>
        <Icon size={props?.size} src={chain?.icon} />
        {chain?.name}
      </PrimitiveTag>
    </EventBlocker>
  );
}
