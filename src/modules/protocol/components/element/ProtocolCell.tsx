import type { Protocol } from "@merkl/api";
import { Box, Button, Icon, Image, Text } from "dappkit";
import type { BoxProps } from "dappkit";

export type ProtocolCellProps = {
  protocol: Protocol;
} & BoxProps;

export default function ProtocolCell({ protocol }: ProtocolCellProps) {
  return (
    <Button
      key={protocol.name}
      to={`/protocols/${protocol.id}`}
      look="soft"
      className="min-w-[8rem] md:min-w-[12rem] aspect-square">
      <Box
        size="xl"
        content="xs"
        className="border-accent-10 bg-accent-0 border-1 w-full h-full aspect-square flex items-center justify-center relative">
        <Image className="size-12" src={protocol.icon} alt={protocol.name} />
        <Text size={4} look="base" className="text-wrap text-center [overflow-wrap:anywhere]">
          {protocol.name}
        </Text>
        <Icon remix="RiArrowRightUpLine" size="xl" className="text-accent-12 absolute bottom-3 right-3" />
      </Box>
    </Button>
  );
}
