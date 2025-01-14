import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { isAddress } from "viem";
import HistoricalClaimsLibrary from "../../../components/element/historicalClaimsLibrary/HistoricalClaimsLibrary";
import { ClaimsService } from "../../../modules/claim/claim.service";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";
  const claims = await ClaimsService.getForUser(address);
  return json({ claims });
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
