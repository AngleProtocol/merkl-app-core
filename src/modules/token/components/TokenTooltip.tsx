import { useMerklConfig } from "@core/modules/config/config.context";
import type { Chain, Explorer, Token } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, Show, Text, Value, mergeClass } from "dappkit";

export type TokenTooltipProps = {
  token: Token;
  size?: "sm" | "md" | "lg" | "xl" | "xs";
  chain?: Chain & { explorers: Explorer[] };
};

export default function TokenTooltip({ token, size }: TokenTooltipProps) {
  const routes = useMerklConfig(store => store.config.routes);
  const tokenPageExists = Object.values(routes).some(({ type }) => {
    type === "token";
  });

  return (
    <>
      <Group className="flex-col">
        <Group className="w-full justify-between items-center p-xs [&>*]:w-full" size="xl">
          <Button
            to={tokenPageExists ? `/tokens/${token?.symbol}` : undefined}
            look="soft"
            size="md"
            className={mergeClass("justify-between flex !w-full", !tokenPageExists ? "!cursor-auto" : "")}>
            <Group>
              <Icon size={size} src={token.icon} />
              <Text size="md" className="text-main-12" bold>
                {token?.name}
              </Text>
            </Group>
            <Show if={tokenPageExists}>
              <Icon size={size} remix="RiArrowRightLine" />
            </Show>
          </Button>
        </Group>
        <Divider look="soft" horizontal />
        {!token.isPreTGE && token.price !== null && token.price !== undefined && (
          <Group className="w-full justify-between">
            <Text>Unit Price:</Text>
            <Value format={"$0.######"}>{token.price}</Value>
          </Group>
        )}
        {token.isPreTGE && token.price !== null && token.price !== undefined && (
          <Group className="w-full justify-between">
            <Text>Pre TGE Unit Price:</Text>
            <Value format={"$0.######"}>{token.price}</Value>
          </Group>
        )}
        {token.isPreTGE && (
          <Group className="w-full justify-between flex">
            <Icon remix="RiTimer2Fill" size="md" />
            <Text size="sm">
              This token hasn’t launched yet.
              <br />
              Unit price is estimated and subject to change.
            </Text>
          </Group>
        )}
        <Group className="w-full justify-between">
          <Text>Token Address:</Text>
          <Hash copy format="short" size="md">
            {token.address}
          </Hash>
        </Group>
      </Group>
    </>
  );
}
