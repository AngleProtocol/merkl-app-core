import type { TagProps, TagType, TagTypes } from "@core/components/element/Tag";
import Tag from "@core/components/element/Tag";
import { useMerklConfig } from "@core/modules/config/config.context";
import type { PickAndOptOut } from "@core/utils/object";
import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import {
  type Component,
  Group,
  Icon,
  Icons as IconGroup,
  type IconProps,
  type IconsProps,
  Text,
  Title,
  Tooltip,
} from "dappkit";
import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const opportunityPercentage = useMerklConfig(store => store.config.opportunityPercentage);
  /**
   * Formatted name
   */
  const configuredName = useMemo(() => {
    if (!opportunityPercentage) return name.replace(/\s*\d+(\.\d+)?%$/, "").trim();
    return name;
  }, [name, opportunityPercentage]);

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
   * @param tags which tags to display, the order has its importance
   * @param props tag item props
   */
  const Tags = useCallback(
    function TagsComponent({
      tags: selectedTags,
      ...props
    }: { tags: (keyof TagTypes)[] } & Omit<Component<TagProps<keyof TagTypes>, HTMLButtonElement>, "value" | "type">) {
      if (!selectedTags?.length || !tags?.length) return null;

      // Create a map of available tags for O(1) lookup
      const availableTags = new Map(tags.filter(tag => tag !== undefined).map(tag => [tag.type, tag]));

      // Filter and order tags based on the selectedTags array
      return selectedTags
        .map(type => availableTags.get(type))
        .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined)
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
   * Explainer for the opportunity with Helpers
   */
  const description = useMemo(() => {
    const symbols = tokens?.map(t => t.symbol).join("-");

    switch (action) {
      case "POOL":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Provide liquidity on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Earn rewards based on your liquidity position.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by providing liquidity to the {protocol?.name} {symbols} pool on {chain.name}, or through a
            liquidity manager supported by Merkl
          </Tooltip>
        );
      case "HOLD":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Hold {symbols}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by holding {symbols} or by staking it in a supported contract
          </Tooltip>
        );
      case "LEND":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Lend assets on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by supplying liquidity to the {protocol?.name} {symbols} on {chain.name}
          </Tooltip>
        );
      case "BORROW":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Borrow assets on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        <Text className="inline"> anytime via Merkl (updated every 3-12 hours).</Text>
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by taking a long position on {protocol?.name} {symbols} on {chain.name}
          </Tooltip>
        );
      case "DROP":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Check your eligibility on Merkl.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Eligible rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Visit your dashboard to check if you've earned rewards from this airdrop
          </Tooltip>
        );
      case "LONG":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Open a long position on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          rewards
                        </Link>
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by taking a long position on {protocol?.name} {symbols} on {chain.name}
          </Tooltip>
        );
      case "SHORT":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Open a short position on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by taking a short position on {protocol?.name} {symbols} on {chain.name}
          </Tooltip>
        );
      case "SWAP":
        return (
          <Tooltip
            helper={
              <>
                <Title h={5}>Steps to Earn Rewards</Title>
                <Text>
                  <ul className="list-disc ml-lg">
                    <li>
                      <Group>
                        <Text bold>Step 1:</Text>Open a short position on {protocol?.name}.
                      </Group>
                    </li>
                    <li>
                      <Group>
                        <Text bold>Step 2:</Text>Rewards accumulate automatically.
                      </Group>
                    </li>
                    <li>
                      <Group className="flexitems-center flex-wrap inline" size="sm">
                        <Text bold className="inline">
                          Step 3:
                        </Text>{" "}
                        Claim
                        <Link to="/users" className="inline">
                          {" "}
                          rewards
                        </Link>{" "}
                        anytime via Merkl (updated every 3-12 hours).
                        <Link to="/status" target="_blank" className="inline">
                          <Text className="inline" look="tint">
                            {" "}
                            Check next reward update
                          </Text>
                        </Link>
                      </Group>
                    </li>
                  </ul>
                </Text>
              </>
            }>
            Earn rewards by trading {symbols} on {chain.name}
          </Tooltip>
        );
      default:
        break;
    }
  }, [tokens, protocol, chain, action]);

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
