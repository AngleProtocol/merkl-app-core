import ChainTag from "@core/modules/chain/components/element/ChainTag";
import type { Chain, Token } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { useSearchParams } from "@remix-run/react";
import {
  Button,
  type Component,
  Divider,
  Dropdown,
  EventBlocker,
  Group,
  Hash,
  Icon,
  PrimitiveTag,
  type PrimitiveTagProps,
  Text,
  useWalletContext,
} from "dappkit";
import merklConfig from "../../config";
import { actions } from "../../config/actions";
import { statuses } from "../../config/status";
import TokenChainTag from "../../modules/token/components/element/TokenChainTag";
import TokenTag from "../../modules/token/components/element/TokenTag";

export type TagTypes = {
  chain: Opportunity["chain"];
  token: Token;
  tokenChain: Token & { chain?: Chain };
  protocol: Opportunity["protocol"] | undefined;
  action: Opportunity["action"];
  status: Opportunity["status"];
};

export type TagType<T extends keyof TagTypes = keyof TagTypes> = {
  type: T;
  value: TagTypes[T];
};
export type TagProps<T extends keyof TagTypes> = {
  type: T;
  look?: PrimitiveTagProps["look"];
  value: TagTypes[T];
  filter?: boolean;
  size?: PrimitiveTagProps["size"];
};

export default function Tag<T extends keyof TagTypes>({
  type,
  filter,
  value,
  ...props
}: Component<TagProps<T>, HTMLButtonElement>) {
  const { chains } = useWalletContext();
  const [_searchParams, setSearchParams] = useSearchParams();

  switch (type) {
    case "status": {
      const status = statuses[value as TagTypes["status"]] ?? statuses.LIVE;
      return (
        <EventBlocker>
          <PrimitiveTag
            className={!filter ? "pointer-events-none" : ""}
            onClick={() => {
              setSearchParams(s => {
                s.set("status", value as TagTypes["status"]);
                return s;
              });
            }}
            look="soft"
            {...props}>
            <Icon size={props?.size} {...status.icon} />
            {status?.label}
          </PrimitiveTag>
        </EventBlocker>
      );
    }
    case "chain": {
      return <ChainTag chain={value as TagTypes["chain"]} {...props} />;
    }
    case "action": {
      const action = actions[value as TagTypes["action"]];
      if (!action) return <Button {...props}>{value}</Button>;
      return (
        <EventBlocker>
          <PrimitiveTag
            className={!filter && "pointer-events-none"}
            onClick={() =>
              setSearchParams(s => {
                s.set("action", value as TagTypes["action"]);
                return s;
              })
            }
            look="tint"
            key={value}
            {...props}>
            <Icon size={props?.size} {...action.icon} />
            {action?.label}
          </PrimitiveTag>
        </EventBlocker>
      );
    }
    case "token": {
      return <TokenTag token={value as TagTypes["token"]} {...props} />;
    }
    case "tokenChain": {
      return <TokenChainTag token={value as TagTypes["tokenChain"]} />;
    }
    case "protocol": {
      const protocol = value as TagTypes["protocol"];

      if (!protocol) return <Button {...props}>{value}</Button>;
      return (
        <EventBlocker>
          <Dropdown
            size="lg"
            padding="xs"
            content={
              <Group className="flex-col">
                <Group size="sm">
                  <Icon size={props?.size} src={protocol?.icon} />
                  <Text size="sm" className="text-main-12" bold>
                    {value?.name}
                  </Text>
                </Group>
                <Divider className="border-main-6" horizontal />
                {/* <Text size="xs">{token?.description}</Text> */}
                <Group className="flex-col" size="md">
                  <Button to={`/protocols/${protocol?.id}`} size="xs" look="soft">
                    <Icon remix="RiArrowRightLine" />
                    Check opportunities on {protocol?.name}
                  </Button>
                  {protocol.url && (
                    <Button external to={protocol.url} size="xs" look="soft">
                      <Icon remix="RiArrowRightLine" />
                      Visit {protocol?.name}
                    </Button>
                  )}
                </Group>
              </Group>
            }>
            <PrimitiveTag look="base" key={value} {...props}>
              <Icon src={protocol?.icon} />
              {value?.name}
            </PrimitiveTag>
          </Dropdown>
        </EventBlocker>
      );
    }
    default:
      return <PrimitiveTag {...props}>{value}</PrimitiveTag>;
  }
}
