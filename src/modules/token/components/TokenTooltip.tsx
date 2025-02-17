import merklConfig from "@core/config";
import type { Chain, Explorer, Token } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, Text, Value } from "dappkit";

export type TokenTooltipProps = {
  token: Token;
  size?: "sm" | "md" | "lg" | "xl" | "xs";
  chain?: Chain & { explorers: Explorer[] };
};

export default function TokenTooltip({ token, size, chain }: TokenTooltipProps) {
  return (
    <>
      <Group className="flex-col">
        <Group className="w-full justify-between items-center" size="xl">
          <Group size="sm">
            <Icon size={size} src={token.icon} />
            <Text size="sm" className="text-main-12" bold>
              {token?.name}
            </Text>
          </Group>
          <Text size="xs">
            <Hash copy format="short" size="xs">
              {token.address}
            </Hash>
          </Text>
        </Group>
        {token.price !== null && token.price !== undefined && <>
          <Divider look="soft" horizontal />
          <Group>
          <Text>Price:</Text><Value format={"$0.######"}>{token.price}</Value></Group>
        </>}
        {((merklConfig?.tagsDetails?.token?.visitOpportunities?.enabled ?? false) ||
          (chain?.explorers?.length ?? 0) > 0) && (
          <>
            <Divider look="soft" horizontal />
            <Group className="flex-col" size="md">
              {/* Conditionally render the "Check opportunities" link */}
              {(merklConfig?.tagsDetails?.token?.visitOpportunities?.enabled ?? false) && (
                <Button to={`/tokens/${token?.symbol}`} size="xs" look="soft">
                  <Icon remix="RiArrowRightLine" />
                  Check opportunities with {token?.symbol}
                </Button>
              )}
              {chain?.explorers?.map(explorer => (
                <Button
                  key={`${explorer.url}`}
                  to={`${explorer.url}/token/${token.address}`}
                  external
                  size="xs"
                  look="soft">
                  <Icon remix="RiArrowRightLine" />
                  Visit explorer
                </Button>
              ))}
            </Group>
          </>
        )}
      </Group>
    </>
  );
}
