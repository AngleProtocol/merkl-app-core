import { api } from "@core/api";
import { useLoaderData } from "react-router";
import { Container, Space } from "dappkit";
import { isAddress } from "viem";
import HistoricalClaimsLibrary from "../../../components/element/historicalClaimsLibrary/HistoricalClaimsLibrary";
import { ClaimsService } from "../../../modules/claim/claim.service";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ context: { backend }, request, params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";
  const claims = await ClaimsService({ api, request, backend }).getForUserFromRequest(address);
  return { claims };
}
export default function Index() {
  const { claims } = useLoaderData<typeof loader>();

  const claimWiped = claims.filter(claim => claim.amount !== "0");

  return (
    <Container>
      <Space size="md" />
      <HistoricalClaimsLibrary claims={claimWiped} />
      <Space size="md" />
    </Container>
  );
}
