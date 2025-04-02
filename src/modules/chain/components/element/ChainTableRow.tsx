import { ChainRow } from "@core/modules/chain/components/library/ChainTable";
import type { Chain } from "@merkl/api";
import { Link } from "react-router";
import { type BoxProps, Group, Icon, Title, mergeClass } from "dappkit";

export type ChainTableRowProps = {
  chain: Chain;
} & BoxProps;

export default function ChainTableRow({ chain, className, ...props }: ChainTableRowProps) {
  return (
    <Link to={`/chains/${chain.name.replace(" ", "-").toLowerCase()}`}>
      <ChainRow
        size="lg"
        content="sm"
        className={mergeClass("", className)}
        {...props}
        chainColumn={
          <Group className="py-md flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
            <Group className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Title
                h={3}
                size={4}
                className="text-nowrap flex gap-lg whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                <Icon src={chain.icon} />
                {chain.name}
              </Title>
            </Group>
          </Group>
        }
      />
    </Link>
  );
}
