import Hero from "@core/components/composite/Hero";
import { ErrorHeading } from "@core/components/layout/ErrorHeading";
import merklConfig from "@core/config";
import useParticipate from "@core/hooks/useParticipate";
import { Cache } from "@core/modules/cache/cache.service";
import { ChainService } from "@core/modules/chain/chain.service";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import OpportunityParticipateModal from "@core/modules/opportunity/components/element/OpportunityParticipateModal";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import useOpportunityMetrics from "@core/modules/opportunity/hooks/useOpportunityMetrics";
import { OpportunityService } from "@core/modules/opportunity/opportunity.service";
import { withUrl } from "@core/utils/url";
import type { Campaign, Chain } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Meta, Outlet, useLoaderData } from "@remix-run/react";
import { Button, Group, Icon } from "dappkit";
import { useClipboard } from "dappkit";
import React, { useCallback, useMemo } from "react";

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });

  const opportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });

  return withUrl(request, {
    //TODO: remove workaroung by either calling opportunity + campaigns or uniformizing api return types
    opportunity: opportunity as typeof opportunity & Opportunity,
    chain,
  });
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrap(data?.url, location.pathname, "opportunity", data?.opportunity);
};

export type OutletContextOpportunity = {
  opportunity: Opportunity & { campaigns: Campaign[] };
  chain: Chain;
};

export default function Index() {
  const { opportunity, chain } = useLoaderData<typeof loader>();

  const { headerMetrics } = useOpportunityMetrics(opportunity);
  const { title, Tags, description, link, url: protocolUrl, icons } = useOpportunityData(opportunity);
  const [isSupplyModalOpen, setSupplyModalOpen] = React.useState<boolean>(false);

  const { copy: copyCall, isCopied } = useClipboard();

  const currentLiveCampaign = opportunity.campaigns?.[0];

  const { targets } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier);

  const isSupplyButtonVisible = useMemo(() => {
    if (!!targets) return true;
    if (!protocolUrl) return false;
    return true;
  }, [protocolUrl, targets]);

  const onSupply = useCallback(() => {
    if ((!merklConfig.deposit && !!protocolUrl) || !targets) return window.open(protocolUrl, "_blank");
    setSupplyModalOpen(true);
  }, [protocolUrl, targets]);

  return (
    <>
      <Meta />
      <Hero
        icons={icons}
        title={
          <Group className="items-center md:flex-nowrap" size="lg">
            <span className="w-full md:w-auto md:flex-1">{title} </span>
            {!!isSupplyButtonVisible && (
              <Button className="inline-flex" look="hype" size="md" onClick={onSupply}>
                Supply
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
            <OpportunityParticipateModal opportunity={opportunity} state={[isSupplyModalOpen, setSupplyModalOpen]} />
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
        tags={<Tags tags={["chain", "protocol", "action", "tokenChain", "token", "status"]} size="sm" />}
        sideDatas={headerMetrics}>
        <Outlet context={{ opportunity, chain }} />
      </Hero>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
