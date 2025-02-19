import type { TagProps, TagType, TagTypes } from "@core/components/element/Tag";
import Tag from "@core/components/element/Tag";
import merklConfig from "@core/config";
import type { PickAndOptOut } from "@core/utils/object";
import type { Opportunity } from "@merkl/api";
import { type Component, Icon, Icons as IconGroup, type IconProps, type IconsProps } from "dappkit";
import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { OpportunityService } from "../opportunity.service";

const metadata = [
  "name",
  "identifier",
  "action",
  "status",
  "type",
  "protocol",
  "depositUrl",
  "chain",
  "tokens",
  "tags",
] satisfies (keyof Opportunity)[];

/**
 * Formats basic metadata for a given opportunity
 */
export default function useOpportunityMetadata({
  name,
  identifier,
  type,
  action,
  status,
  chain,
  tokens,
  protocol,
  depositUrl,
  ...opportunity
}: PickAndOptOut<Opportunity, (typeof metadata)[number], "depositUrl" | "protocol">) {
  /**
   * Formatted name
   */
  const configuredName = useMemo(() => {
    if (!merklConfig.opportunityPercentage) return name.replace(/\s*\d+(\.\d+)?%$/, "").trim();
    return name;
  }, [name]);

  /**
   * Formatted name split into multiple spans to be used in page header titles
   */
  const title = useMemo(() => {
    const spaced = configuredName.split(" ");

    return spaced
      .map(str => {
        const key = str + uuidv4();
        if (!str.match(/[\p{Letter}\p{Mark}]+/gu))
          return [
            <span key={key} className="text-accent-11">
              {str}
            </span>,
          ];
        if (str.includes("-"))
          return str
            .split("-")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-accent-11">-</span>]);
        if (str.includes("/"))
          return str
            .split("/")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-accent-11">/</span>]);
        return [<span key={key}>{str}</span>];
      })
      .flatMap((str, index, arr) => [str, index !== arr.length - 1 && " "]);
  }, [configuredName]);

  /**
   * TagProps for each metadata that can be represented as a tag
   */
  const tags = useMemo(() => {
    const tag = <T extends keyof TagTypes>(tagType: T, value: TagType<T>["value"]) =>
      !!value
        ? {
            type: tagType,
            value,
            key: `${tagType}_${
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              (value as any)?.address ?? (value as any)?.name ?? value
            }`,
          }
        : undefined;

    return [
      tag("protocol", protocol),
      tag("chain", chain),
      tag("action", action),
      ...tokens.map(token => tag("token", token)),
      tag("status", status),
    ].filter(a => a !== undefined);
  }, [protocol, action, status, tokens, chain]);

  /**
   * Extensible tags components that can be filtered
   * @param hide which tags to filers out
   * @param props tag item props
   */
  const Tags = useCallback(
    function TagsComponent({
      hide,
      only,
      ...props
    }: { hide?: (keyof TagTypes)[]; only?: (keyof TagTypes)[] } & Omit<
      Component<TagProps<keyof TagTypes>, HTMLButtonElement>,
      "value" | "type"
    >) {
      return tags
        ?.filter(a => a !== undefined)
        ?.filter(({ type }) => !hide || !hide.includes(type))
        ?.filter(({ type }) => !only || only.includes(type))
        .map(tag => <Tag {...tag} key={tag.key ?? uuidv4()} size="sm" {...props} />);
    },
    [tags],
  );

  /**
   * Internal link to the opportunity on this app
   */
  const link = useMemo(
    () => `/opportunities/${chain?.name?.toLowerCase?.().replace(" ", "-")}/${type}/${identifier}`,
    [type, identifier, chain],
  );

  /**
   * External link to the opportunity
   */
  const url = useMemo(() => {
    if (!!depositUrl) return depositUrl;
    if (!!protocol?.url) return protocol?.url;
  }, [depositUrl, protocol]);

  /**
   * Tokens that are used to define an opportunity's main icons
   */
  const iconTokens = useMemo(() => {
    if (tokens.length > 1) return tokens.filter(token => !!token.icon);
    return tokens;
  }, [tokens]);

  /**
   * Main icons that define an opportunity
   */
  const icons = useMemo(() => iconTokens.map(t => ({ src: t.icon }) satisfies IconProps), [iconTokens]);

  /**
   * Extensible icons group component
   */
  const Icons = useCallback(
    function IconsComponent({ groupProps, ...props }: { groupProps?: Omit<IconsProps, "children"> } & IconProps) {
      return (
        <IconGroup {...groupProps}>
          {icons.map(icon => (
            <Icon key={uuidv4()} {...icon} {...props} />
          ))}
        </IconGroup>
      );
    },
    [icons],
  );

  /**
   * Explainer for the opportunity
   */
  const description = useMemo(
    () => OpportunityService.getDescription({ tokens, protocol, chain, action }),
    [tokens, protocol, chain, action],
  );

  return {
    name: configuredName,
    title,
    link,
    url,
    icons,
    Icons,
    iconTokens,
    description,
    opportunity: {
      ...opportunity,
      name: configuredName,
    },
    tags,
    Tags,
  };
}
