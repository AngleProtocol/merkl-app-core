import type { Chain } from "@merkl/api";
import { Button, Divider, Dropdown, Group, Hash, Icon, PrimitiveTag } from "dappkit";

export type UserProps = { address: string; chain: Chain };

export default function User({ address, chain }: UserProps) {
  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={
        <Group className="flex-col">
          <Group size="sm">
            <Icon size={"sm"} remix="RiUserFill" />
            <Hash format="short" look="bold" bold copy>
              {address}
            </Hash>
          </Group>
          <Divider className="border-main-6" horizontal />
          {/* <Text size="xs">{token?.description}</Text> */}
          <Group className="flex-col" size="md">
            <Button to={`/users/${address}`} size="xs" look="soft">
              <Icon remix="RiArrowRightLine" />
              Check user dashboard
            </Button>
            {chain?.explorers?.map(explorer => {
              return (
                <Button
                  key={`${explorer.url}`}
                  to={`${explorer.url}/address/${address}`}
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
      <PrimitiveTag look="soft">
        <Hash format="short">{address}</Hash>
      </PrimitiveTag>
    </Dropdown>
  );
}
