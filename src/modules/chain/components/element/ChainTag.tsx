import useChain from "@core/modules/chain/hooks/useChain";
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

export default function ChainTag({ chain: { id }, ...props }: { chain: { id: number } } & PrimitiveTagProps) {
  const { chain } = useChain({ id });

  if (!chain) return;
  return (
    <EventBlocker>
      <Dropdown
        size="lg"
        padding="xs"
        content={
          <Group className="flex-col">
            <Group className="w-full justify-between items-center" size="xl">
              <Group size="sm">
                <Icon src={chain?.icon} />
                <Text size="sm" className="text-accent-12" bold>
                  {chain?.name}
                </Text>
              </Group>
              <Text size="xs">
                Chain ID:{" "}
                <Hash size="xs" format="full" copy>
                  {chain?.id?.toString()}
                </Hash>
              </Text>
            </Group>

            <Divider look="soft" horizontal />
            <Group className="flex-col">
              <Button to={`/chains/${chain?.name.replace(" ", "-").toLowerCase()}`} size="xs" look="soft">
                <Icon remix="RiArrowRightLine" /> Check opportunities on {chain.name}
              </Button>
            </Group>
          </Group>
        }>
        <PrimitiveTag look="base" key={chain.name} {...props}>
          <Icon size={props?.size} src={chain?.icon} />
          {chain?.name}
        </PrimitiveTag>
      </Dropdown>
    </EventBlocker>
  );
}
