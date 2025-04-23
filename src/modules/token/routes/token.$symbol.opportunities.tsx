import { Cache } from "@core/modules/cache/cache.service";
import OpportunityLibrary from "@core/modules/opportunity/components/library/OpportunityLibrary";
import { Container, Group, Space } from "dappkit";
import { useOutletContext } from "react-router";
import type { OutletContextTokens } from "./token.$symbol.header";

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
