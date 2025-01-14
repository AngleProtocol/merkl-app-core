import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container } from "dappkit";
import { isAddress } from "viem";
import PositionLibrary from "../../../components/element/position/PositionLibrary";
import merklConfig from "../../../config";
import { LiquidityService } from "../../../modules/liquidity/liquidity.service";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  // need to be improved and remove chainId fromUrl
  const defaultChain = merklConfig.chains?.[0]?.id ?? 1;

  const positions = await LiquidityService.getForUser({
    address,
    chainId: defaultChain,
  });
  return json({ positions });
}

export default function Index() {
  const { positions } = useLoaderData<typeof loader>();
  return (
    <Container>
      <PositionLibrary positions={positions} />
    </Container>
  );
}
