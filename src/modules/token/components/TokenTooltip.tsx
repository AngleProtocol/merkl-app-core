import type { Chain, Explorer, Token } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, Text, Value } from "dappkit";

export type TokenTooltipProps = {
  token: Token;
  size?: "sm" | "md" | "lg" | "xl" | "xs";
  chain?: Chain & { explorers: Explorer[] };
};

export default function TokenTooltip({ token, size }: TokenTooltipProps) {
  return (
    <>
      <Group className="flex-col">
        <Group className="w-full justify-between items-center p-xs [&>*]:w-full" size="xl">
          <Button to={`/tokens/${token?.symbol}`} look="soft" size="md" className="justify-between flex !w-full">
            <Group>
              <Icon size={size} src={token.icon} />
              <Text size="md" className="text-main-12" bold>
                {token?.name}
              </Text>
            </Group>
            <Icon size={size} remix="RiArrowRightLine" />
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
