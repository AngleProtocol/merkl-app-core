import ChainTag from "@core/modules/chain/components/element/ChainTag";
import ProtocolTag from "@core/modules/protocol/components/element/ProtocolTag";
import type { Chain, Token } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Button, type Component, Icon, PrimitiveTag, type PrimitiveTagProps } from "dappkit";
import type { ReactNode } from "react";
import { actions } from "../../config/actions";
import { statuses } from "../../config/status";
import TokenChainTag from "../../modules/token/components/element/TokenChainTag";
import TokenTag from "../../modules/token/components/element/TokenTag";
import ExplorerTag from "./ExplorerTag";

export type TagTypes = {
  chain: Opportunity["chain"];
  token: Token;
  tokenChain: Token & { chain?: Chain };
  protocol: Opportunity["protocol"] | undefined;
  action: Opportunity["action"];
  status: Opportunity["status"];
  explorer: { address: string; chainId: number };
  preTGE: boolean;
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
  suffix?: ReactNode;
};

export default function Tag<T extends keyof TagTypes>({
  type,
  filter,
  value,
  suffix,
  ...props
}: Component<TagProps<T>, HTMLButtonElement>) {
  switch (type) {
    case "explorer": {
      const explorer = value as TagTypes["explorer"];
      return <ExplorerTag chain={{ id: explorer.chainId }} address={explorer.address} suffix={suffix} {...props} />;
    }
    case "status": {
      const status = statuses[value as TagTypes["status"]] ?? statuses.LIVE;
      return (
        <PrimitiveTag className={!filter ? "pointer-events-none" : ""} look="soft" {...props}>
          <Icon size={props?.size} {...status.icon} />
          {status?.label}
          {suffix}
        </PrimitiveTag>
      );
    }
    case "chain": {
      return <ChainTag suffix={suffix} chain={value as TagTypes["chain"]} {...props} />;
    }
    case "action": {
      const action = actions[value as TagTypes["action"]];
      if (!action) return <Button {...props}>{value as string}</Button>;
      return (
        <PrimitiveTag className={!filter ? "pointer-events-none" : ""} look="soft" key={action.label} {...props}>
          <Icon size={props?.size} {...action.icon} />
          {action?.label}
          {suffix}
        </PrimitiveTag>
      );
    }
    case "token": {
      return <TokenTag suffix={suffix} token={value as TagTypes["token"]} {...props} />;
    }
    case "tokenChain": {
      return <TokenChainTag suffix={suffix} token={value as TagTypes["tokenChain"]} />;
    }
    case "protocol": {
      const protocol = value as TagTypes["protocol"];

      if (!protocol) return;
      return <ProtocolTag suffix={suffix} look="bold" protocol={protocol} {...props} />;
    }
    case "preTGE": {
      return (
        (value as TagTypes["preTGE"]) && (
          <PrimitiveTag look="hype" {...props}>
            <Icon size={props?.size} remix="RiBasketballFill" />
            Pre-TGE
          </PrimitiveTag>
        )
      );
    }

    default:
      return (
        <PrimitiveTag {...props}>
          {value as string}
          {suffix}
        </PrimitiveTag>
      );
  }
}
