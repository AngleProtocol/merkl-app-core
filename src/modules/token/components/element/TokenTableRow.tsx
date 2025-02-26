import merklConfig from "@core/config";
import { TokenRow } from "@core/modules/token/components/library/TokenTable";
import type { Token } from "@merkl/api";
import { Link } from "@remix-run/react";
import { Button, Group, Icon, Value } from "dappkit";
import type { BoxProps } from "dappkit";
import { Title } from "dappkit";
import { mergeClass } from "dappkit";

export type TokenTableRowProps = {
  token: Token;
} & BoxProps;

export default function TokenTableRow({ token, className, ...props }: TokenTableRowProps) {
  return (
    <Link to={`/tokens/${token.symbol}`}>
      <TokenRow
        size="lg"
        content="sm"
        className={mergeClass("", className)}
        {...props}
        tokenColumn={
          <Group className="py-md flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
            <Group className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Title
                h={3}
                size={4}
                className="text-nowrap flex gap-lg whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                <Icon src={token.icon} />
                {token.name}
              </Title>
            </Group>
          </Group>
        }
        priceColumn={
          <Group className="py-xl">
            <Button look={"soft"} className="font-mono">
              <Value value format={merklConfig.decimalFormat.dollar}>
                {token.price ?? 0}
              </Value>
            </Button>
          </Group>
        }
      />
    </Link>
  );
}
