import { Outlet } from "@remix-run/react";
import { Icon } from "dappkit";
import { useWalletContext } from "dappkit";
import config from "merkl.config";
import { useMemo, useState } from "react";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { address } = useWalletContext();
  // Dynamically compute tabs based on config and address validity
  const tabs = useMemo(() => {
    if (!address || !isAddress(address)) {
      return [];
    }
    const baseTabs = [
      {
        label: (
          <>
            <Icon size="sm" remix="RiGift2Fill" />
            Rewards
          </>
        ),
        link: `/users/${address}`,
        key: "Rewards",
      },
      {
        label: (
          <>
            <Icon size="sm" remix="RiDropFill" />
            Liquidity
          </>
        ),
        link: `/users/${address}/liquidity`,
        key: "Liquidity",
      },
      {
        label: (
          <>
            <Icon size="sm" remix="RiListCheck3" />
            Claims
          </>
        ),
        link: `/users/${address}/claims`,
        key: "Claims",
      },
    ];

    // Filter out the Liquidity tab if it's disabled in the config
    return baseTabs.filter(tab => !(tab.key === "Liquidity" && !config.dashboard.liquidityTab.enabled));
  }, [address]);

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={!!config.dashboardPageName ? config.dashboardPageName : "Claims"}
      description={"Claim and monitor the rewards awarded through Merkl"}
      tabs={tabs}>
      <Outlet />
    </Hero>
  );
}
