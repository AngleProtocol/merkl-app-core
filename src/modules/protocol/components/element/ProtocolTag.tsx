import type { Protocol } from "@merkl/api";
import {
    Button,
    Divider,
    Dropdown,
    EventBlocker,
    Group, Icon,
    PrimitiveTag,
    type PrimitiveTagProps,
    Text
} from "dappkit";
import useProtocolMetadata from "../../hooks/useProtocolMetadata";

export default function ProtocolTag({ protocol, ...props }: { protocol: Protocol } & PrimitiveTagProps) {
  const { name, link, icon } = useProtocolMetadata(protocol);

  return (
    <EventBlocker>
      <Dropdown
        size="lg"
        padding="xs"
        content={
          <Group className="flex-col">
            <Group size="sm">
              <Icon size={props?.size} src={protocol?.icon} />
              <Text size="sm" className="text-main-12" bold>
                {name}
              </Text>
            </Group>
            <Divider className="border-main-6" horizontal />
            {/* <Text size="xs">{token?.description}</Text> */}
            <Group className="flex-col" size="md">
              <Button to={link} size="xs" look="soft">
                <Icon remix="RiArrowRightLine" />
                Check opportunities on {name}
              </Button>
              {protocol.url && (
                <Button external to={protocol.url} size="xs" look="soft">
                  <Icon remix="RiArrowRightLine" />
                  Visit {name}
                </Button>
              )}
            </Group>
          </Group>
        }>
        <PrimitiveTag look="base" key={protocol?.id} {...props}>
          <Icon src={icon} />
          {name}
        </PrimitiveTag>
      </Dropdown>
    </EventBlocker>
  );
}
