import type { Chain } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Meta, Outlet, useLoaderData } from "@remix-run/react";
import { Button, Group, Icon } from "dappkit";
import { useClipboard } from "dappkit";
import merklConfig from "merkl.config";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Hero from "../../../components/composite/Hero";
import Tag from "../../../components/element/Tag";
import OpportunityParticipateModal from "../../../components/element/opportunity/OpportunityParticipateModal";
import { ErrorHeading } from "../../../components/layout/ErrorHeading";
import useOpportunity from "../../../hooks/resources/useOpportunity";
import { Cache } from "../../../modules/cache/cache.service";
import { ChainService } from "../../../modules/chain/chain.service";
import type { OpportunityWithCampaigns } from "../../../modules/opportunity/opportunity.model";
import { OpportunityService } from "../../../modules/opportunity/opportunity.service";

export async function loader({ params: { id, type, chain: chainId } }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });

  const rawOpportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });
  return json({ rawOpportunity, chain });
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [
    {
      title: `${data?.rawOpportunity.name}`,
    },
  ];
};

export type OutletContextOpportunity = {
  opportunity: OpportunityWithCampaigns;
  chain: Chain;
};

export default function Index() {
  const { rawOpportunity, chain } = useLoaderData<typeof loader>();
  const { tags, description, link, herosData, opportunity, iconTokens } = useOpportunity(rawOpportunity);

  const { copy: copyCall, isCopied } = useClipboard();

  const styleName = useMemo(() => {
    const spaced = opportunity.name.split(" ");

    return spaced
      .map(str => {
        const key = str + uuidv4();
        if (!str.match(/[\p{Letter}\p{Mark}]+/gu))
          return [
            <span key={key} className="text-main-11">
              {str}
            </span>,
          ];
        if (str.includes("-"))
          return str
            .split("-")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-main-11">-</span>]);
        if (str.includes("/"))
          return str
            .split("/")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-main-11">/</span>]);
        return [<span key={key}>{str}</span>];
      })
      .flatMap((str, index, arr) => [str, index !== arr.length - 1 && " "]);
  }, [opportunity]);

  const currentLiveCampaign = opportunity.campaigns?.[0];

  const visitUrl = useMemo(() => {
    if (!!opportunity.depositUrl) return opportunity.depositUrl;
    if (!!opportunity.protocol?.url) return opportunity.protocol?.url;
  }, [opportunity]);

  return (
    <>
      <Meta />
      <Hero
        icons={iconTokens.map(t => ({ src: t.icon }))}
        breadcrumbs={[
          { link: merklConfig.routes.opportunities?.route ?? "/", name: "Opportunities" },
          {
            link: "/",
            name: opportunity.name,
          },
        ]}
        title={
          <Group className="items-center md:flex-nowrap" size="lg">
            <span className="w-full md:w-auto md:flex-1">{styleName} </span>
            {!!visitUrl && (
              <Button to={visitUrl} external className="inline-flex" size="md">
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
            {merklConfig.deposit && (
              <OpportunityParticipateModal opportunity={opportunity}>
                <Button className="inline-flex" look="hype" size="md">
                  Supply
                </Button>
              </OpportunityParticipateModal>
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
        tags={tags.map(tag => (
          <Tag
            key={`${tag?.type}_${
              // biome-ignore lint/suspicious/noExplicitAny: templated type
              (tag?.value as any)?.address ?? tag?.value
            }`}
            {...tag}
            size="sm"
          />
        ))}
        sideDatas={herosData}>
        <Outlet context={{ opportunity, chain }} />
      </Hero>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
