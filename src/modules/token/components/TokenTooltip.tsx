import type { Chain, Explorer, Token } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, mergeClass, Show, Text, Value } from "dappkit";
import { useMerklConfig } from "@core/modules/config/config.context";

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
        {token.price !== null && token.price !== undefined && (
          <Group className="w-full justify-between">
            <Text>Unit Price:</Text>
            <Value format={"$0.######"}>{token.price}</Value>
          </Group>
        )}
        <Group className="w-full justify-between">
          <Hash copy format="short" size="md">
            {token.address}
          </Hash>
        </Group>
      </Group>
    </>
  );
}
