import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Icon } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo, useState } from "react";
import { isAddress } from "viem";
import Hero from "../../../components/composite/Hero";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";

export async function loader({ context: {backend, routes}, request }: LoaderFunctionArgs) {
  return withUrl(request, { backend, routes });
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  return MetadataService({}).fromRoute(data, error, location).wrap();
};

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
            <Icon size="sm" remix="RiListCheck3" />
            History
          </>
        ),
        link: `/users/${address}/claims`,
        key: "History",
      },
    ];

    // Filter out the Liquidity tab if it's disabled in the config
    return baseTabs;
  }, [address]);

  const metadata = useMetadata(data.url);

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={metadata.find(metadata.wrapInPage(), "title")}
      description={metadata.find(metadata.wrap(), "description")}
      tabs={tabs}>
      <Outlet />
    </Hero>
  );
}
