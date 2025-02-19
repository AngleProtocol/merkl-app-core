import merklConfig from "@core/config";
import useChain from "@core/modules/chain/hooks/useChain";
import type { Token } from "@merkl/api";
import {
  Button,
  Divider,
  Dropdown,
  EventBlocker,
  Group,
  Hash,
  Icon,
  PrimitiveTag,
  type PrimitiveTagProps,
  Text,
} from "dappkit";

export default function TokenTag({ token, ...props }: { token: Token } & PrimitiveTagProps) {
  const { chain } = useChain({ id: token.chainId });

  return (
    <EventBlocker>
      <Dropdown
        size="lg"
        padding="xs"
        content={
          <Group className="flex-col">
            <Group className="w-full justify-between items-center" size="xl">
              <Group size="sm">
                <Icon size={props?.size} src={token.icon} />
                <Text size="sm" className="text-accent-12" bold>
                  {token?.name}
                </Text>
              </Group>
              <Text size="xs">
                <Hash copy format="short" size="xs">
                  {token.address}
                </Hash>
              </Text>
            </Group>
            {(chain || (merklConfig?.tagsDetails?.token?.visitOpportunities?.enabled ?? false)) && (
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
        }>
        <PrimitiveTag look="base" key={[token.address, token.symbol, token.chainId].join(" ")} {...props}>
          <Icon size={props?.size} src={token.icon} />
          {token?.symbol}
        </PrimitiveTag>
      </Dropdown>
    </EventBlocker>
  );
}
