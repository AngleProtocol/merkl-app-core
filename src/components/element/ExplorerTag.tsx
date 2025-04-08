import useChain from "@core/modules/chain/hooks/useChain";
import { EventBlocker, Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import { type ReactNode, useCallback } from "react";

export default function ExplorerTag({
  chain: { id },
  address,
  suffix,
  onClick,
  ...props
}: { chain: { id: number }; suffix?: ReactNode; address: string } & PrimitiveTagProps) {
  const { chain } = useChain({ id });

  const navigateToChainPage = useCallback(() => {
    if (!chain) return;
    /**
     * @todo make sure this works will al explorers
     */
    window.open(`${chain.explorers?.[0]?.url}/address/${address}`, "_blank", "noopener,noreferrer");
  }, [chain, address]);

  if (!chain) return;
  return (
    <EventBlocker>
      <PrimitiveTag look="base" key={chain.name} {...props} onClick={onClick || navigateToChainPage}>
        <Icon size={props?.size} remix="RiEarthFill" />
        Explorer
        <Icon size={props?.size} remix="RiArrowRightUpLine" />
        {suffix}
      </PrimitiveTag>
    </EventBlocker>
  );
}
