import { api } from "@core/api";
import Hero from "@core/components/composite/Hero";
import { ErrorHeading } from "@core/components/layout/ErrorHeading";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { useMerklConfig } from "@core/modules/config/config.context";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs } from "react-router";
import { Meta, Outlet, useLoaderData } from "react-router";
import { Button, Group, Icon } from "dappkit";
import { useClipboard } from "dappkit";

export async function loader({
  context: { backend, routes },
  params: { id, type, chain: chainId },
  request,
}: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService({ api }).get({ name: chainId });

  const opportunity = await OpportunityService({ api, request, backend }).getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });

  return {
    //TODO: remove workaroung by either calling opportunity + campaigns or uniformizing api return types
    opportunity: opportunity as typeof opportunity & Opportunity,
    chain,
    backend,
    routes,
    ...MetadataService({ request, backend, routes }).fill(),
  };
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export type OutletContextOpportunity = {
  opportunity: Opportunity & { campaigns: Campaign[] };
  chain: Chain;
};

export default function Index() {
  const { opportunity, chain } = useLoaderData<typeof loader>();

  const { title, description, icons } = useOpportunityData(opportunity);

  const { copy: copyCall, isCopied } = useClipboard();

  const showCopyOpportunityIdToClipboard = useMerklConfig(store => store.config.showCopyOpportunityIdToClipboard);

  return (
    <>
      <Meta />
      <Hero
        icons={icons}
        title={
          <Group className="items-center md:flex-nowrap" size="lg">
            <span className="w-full md:w-auto md:flex-1">{title} </span>
            {!!showCopyOpportunityIdToClipboard && (
              <Button className="inline-flex" look="hype" size="md" onClick={async () => copyCall(opportunity.id)}>
                <Icon remix={isCopied ? "RiCheckboxCircleFill" : "RiFileCopyFill"} size="sm" />
              </Button>
            )}
          </Group>
        }
        breadcrumbs={[{ name: "Opportunity", link: "" }]}
        description={description}>
        <Outlet context={{ opportunity, chain }} />
      </Hero>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
