import { Button, Divider, Dropdown, Group, Icon, PrimitiveTag, Text } from "packages/dappkit/src";
import { useMemo } from "react";

export const interactionRouters = {
    enso: {
        name: "Enso",
        description: "Enso provides abstract on-chain actions, shortcuts and routes that allows dApps to find the best routes to interact with other protocols.",
        url: "https://www.enso.build/",
        icon: "https://framerusercontent.com/images/19ye5oms8sG6XHF1K8p03vLNkg.png"
    },
    zap: {
        name: "Kyberswap Zap",
        description: "Zap enables users to effortlessly add liquidity into any concentrated liquidity protocol using any tokens, thanks to the KyberSwap aggregator.",
        url: "https://docs.kyberswap.com/kyberswap-solutions/kyberswap-zap-as-a-service",
        icon: "https://docs.kyberswap.com/~gitbook/image?url=https%3A%2F%2F1368568567-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fw1XgQJc40kVeGUIxgI7c%252Ficon%252FYl1TDE5MQwDPbEsfCerK%252Fimage%2520%281%29.png%3Falt%3Dmedia%26token%3D3f984a53-8b11-4d1b-b550-193d82610e7b&width=32&dpr=1&quality=100&sign=a7af3e95&sv=2",
    }
}

export interface RouterStatusProps {
    name: keyof typeof interactionRouters;
    loading?: boolean;
}

export default function RouterStatus({name, loading }: RouterStatusProps) {
    const router = useMemo(() => interactionRouters[name], [name])

    return <Dropdown
    content={
      <Group className="flex-col max-w-[42ch]">
        <Text size="sm">{router?.description}</Text>
        {/* TODO: parse actions and find a way to display them better than following: */}
        {/* <Divider look="soft" horizontal /> */}
        {/* {transaction?.actions?.map(({ action, tokens, from, to }) => {
          switch (action) {
            case "fee":
              return (
                <Group>
                  Fee:{" "}
                  {tokens.map(token => (
                    <Token token={token} amount={token.amount} />
                  ))}
                </Group>
              );
            case "swap":
              return (
                <Group>
                  Swap: <Token token={from} amount={from.amount} />
                  <Icon remix="RiArrowRightLine" />
                  <Token token={to} amount={to.amount} />
                </Group>
              );
            case "deposit":
              return (
                <Group>
                  Deposit:{" "}
                  {tokens.map(token => (
                    <Token token={token} amount={token.amount} />
                  ))}
                </Group>
              );
          }
        })} */}
        <Divider look="soft" horizontal />
        <Group className="flex-col">
          <Button
            to={"https://docs.kyberswap.com/kyberswap-solutions/kyberswap-zap-as-a-service"}
            size="xs"
            look="soft">
            <Icon remix="RiArrowRightLine" /> Visit {router.name}
          </Button>
        </Group>
      </Group>
    }>
    <PrimitiveTag size="sm">
      <Icon src={router?.icon} />{" "}
      {router.name}
      {loading && <Icon remix="RiLoader2Fill" className="animate-spin" />}
    </PrimitiveTag>
  </Dropdown>
}