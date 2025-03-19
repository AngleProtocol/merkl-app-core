import { Cache } from "@core/modules/cache/cache.service";
import { useOutletContext } from "@remix-run/react";
import type { OutletContextTokens } from "./token.$symbol.header";
import { Container, Group, Space } from "packages/dappkit/src";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";

export async function loader() {
  return {};
}
export const clientLoader = Cache.wrap("token/opportunities", 300);

export default function Index() {
  const { opportunities, chains, count } = useOutletContext<OutletContextTokens>();

  return (
    <Container>
      <Space size="xl" />
      <Group size="xl" className="py-xl flex-col">
        <OpportunityLibrary exclude={["protocol"]} opportunities={opportunities} count={count} chains={chains} />
      </Group>
    </Container>
  );
}
