import Hero from "@core/components/composite/Hero";
import { ErrorHeading } from "@core/components/layout/ErrorHeading";
import config from "@core/config";
import merklConfig from "@core/config";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityMetrics from "@core/modules/opportunity/hooks/useOpportunityMetrics";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Meta, Outlet, useLoaderData } from "@remix-run/react";
import { Button, Group, Icon } from "dappkit";
import { useClipboard } from "dappkit";

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });

  const opportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });

  return {
    //TODO: remove workaroung by either calling opportunity + campaigns or uniformizing api return types
    opportunity: opportunity as typeof opportunity & Opportunity,
    chain,
    url: `${request.url.split("/")?.[0]}//${request.headers.get("host")}`,
  };
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("opportunity", [data?.url, config, data?.opportunity]);
};

export type OutletContextOpportunity = {
  opportunity: Opportunity & { campaigns: Campaign[] };
  chain: Chain;
};

export default function Index() {
  const { opportunity, chain } = useLoaderData<typeof loader>();

  const { headerMetrics } = useOpportunityMetrics(opportunity);
  const { title, Tags, description, link, url, icons } = useOpportunityData(opportunity);

  const { copy: copyCall, isCopied } = useClipboard();

  const currentLiveCampaign = opportunity.campaigns?.[0];

  return (
    <>
      <Meta />
      <Hero
        icons={icons}
        breadcrumbs={[
          { link: merklConfig.routes.opportunities?.route ?? "/", name: "Opportunities" },
          {
            link: "/",
            name: opportunity.name,
          },
        ]}
        title={
          <Group className="items-center md:flex-nowrap" size="lg">
            <span className="w-full md:w-auto md:flex-1">{title} </span>
            {merklConfig.deposit && (
              <>
                {!!url && (
                  <Button to={url} external className="inline-flex" size="md">
                    <Icon remix="RiArrowRightUpLine" size="sm" />
                  </Button>
                )}
                <OpportunityParticipateModal opportunity={opportunity}>
                  <Button className="inline-flex" look="hype" size="md">
                    Supply
                  </Button>
                </OpportunityParticipateModal>
              </>
            )}
            {!merklConfig.deposit && !!url && (
              <Button className="inline-flex" look="hype" size="md" to={url} external>
                Supply
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
            {(merklConfig.showCopyOpportunityIdToClipboard ?? false) && (
              <Button className="inline-flex" look="hype" size="md" onClick={async () => copyCall(opportunity.id)}>
                <Icon remix={isCopied ? "RiCheckboxCircleFill" : "RiFileCopyFill"} size="sm" />
              </Button>
            )}
          </Group>
        }
        description={description}
        tabs={[
          { label: "Overview", link, key: "overview" },
          {
            label: "Leaderboard",
            link: `${link}/leaderboard?campaignId=${currentLiveCampaign?.campaignId}`,
            key: "leaderboard",
          },
        ]}
        tags={<Tags size="sm" />}
        sideDatas={headerMetrics}>
        <Outlet context={{ opportunity, chain }} />
      </Hero>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
