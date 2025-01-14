import { Button, Divider, Dropdown, Group, Icon, PrimitiveTag, Text } from "dappkit";
import type { ReactNode } from "react";

export type LiquidityTokenRuleProps = { value: { label: ReactNode; percentage: number } };

export default function LiquidityTokenRule(props: LiquidityTokenRuleProps) {
  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={
        <Group className="flex-col">
          <Group size="xs" className="flex-col">
            <Group size="sm">
              <Icon {...status.icon} />
              <Text size="sm" className="text-main-12" bold>
                {status?.label}
              </Text>
            </Group>
          </Group>
          <Divider look="soft" horizontal />
          <Group className="flex-col">
            <Text size="xs">{status?.description}</Text>
            <Button to={`/status/${status?.label}`} size="xs" look="soft">
              <Icon remix="RiArrowRightLine" />
              Open
            </Button>
          </Group>
        </Group>
      }>
      <PrimitiveTag look="soft" {...props}>
        <Icon size={props?.size} {...status.icon} />
        {status?.label}
      </PrimitiveTag>
    </Dropdown>
  );
}
