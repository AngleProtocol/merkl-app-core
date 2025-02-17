import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Icon } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo, useState } from "react";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";
import merklConfig from "../../../config";

export async function loader({ request }: LoaderFunctionArgs) {
  return withUrl(request, {});
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

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
    return baseTabs.filter(tab => !(tab.key === "Liquidity" && !merklConfig.dashboard.liquidityTab.enabled));
  }, [address]);

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={!!merklConfig.dashboardPageName ? merklConfig.dashboardPageName : "Claims"}
      description={MetadataService.getDescription("dashboard/connect", [data.url, merklConfig])}
      tabs={tabs}>
      <Outlet />
    </Hero>
  );
}
