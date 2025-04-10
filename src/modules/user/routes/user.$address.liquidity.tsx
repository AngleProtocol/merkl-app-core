import { api } from "@core/api";
import { Container } from "dappkit";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isAddress } from "viem";
import PositionLibrary from "../../../components/element/position/PositionLibrary";
import { LiquidityService } from "../../../modules/liquidity/liquidity.service";

export async function loader({ context: { backend }, params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  // need to be improved and remove chainId fromUrl
  const defaultChain = backend.chains?.[0]?.id ?? 1;

  const positions = await LiquidityService({ api }).getForUser({
    address,
    chainId: defaultChain,
  });
  return { positions };
}

export default function Index() {
  const { positions } = useLoaderData<typeof loader>();
  return (
    <Container>
      <PositionLibrary positions={positions} />
    </Container>
  );
}
