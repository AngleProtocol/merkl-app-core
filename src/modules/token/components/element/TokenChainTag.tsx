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

export default function TokenChainTag({ token, ...props }: { token: Token } & PrimitiveTagProps) {
  const { chain, link } = useChain({ id: token.chainId });

  if (!chain || !token) return;
  return (
    <EventBlocker>
      <Dropdown
        size="lg"
        padding="xs"
        content={
          <Group className="flex-col">
            <Group size="xs" className="flex-col">
              <Group className="justify-between" size="xl">
                <Text size="xs">Token</Text>
                <Hash format="short" size="xs" copy>
                  {token.address}
                </Hash>
              </Group>
              <Group size="sm">
                <Icon size={props?.size} src={token.icon} />
                <Text size="sm" className="text-accent-12" bold>
                  {token?.name}
                </Text>
              </Group>
            </Group>
            <Divider look="soft" horizontal />
            <Group className="flex-col" size="md">
              <Button to={link} size="xs" look="soft">
                <Icon remix="RiArrowRightLine" /> Check opportunities on {chain?.name}
              </Button>
              {chain?.explorers?.map(explorer => {
                return (
                  <Button
                    key={`${explorer.url}`}
                    to={`${explorer.url}/token/${token.address}`}
                    external
                    size="xs"
                    look="soft">
                    <Icon remix="RiArrowRightLine" />
                    Visit explorer
                  </Button>
                );
              })}
            </Group>
          </Group>
        }>
        <PrimitiveTag look="base" key={[chain.name, token.symbol].join("-")} {...props}>
          <Icon size={props?.size} src={chain.icon} />
          {chain.name}
        </PrimitiveTag>
      </Dropdown>
    </EventBlocker>
  );
}
