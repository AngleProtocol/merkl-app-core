import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space } from "dappkit";
import Hero from "../../../components/composite/Hero";
import Refer from "../components/Refer";
import Referral from "../components/Referral";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  const code = new URL(request.url).searchParams.get("code");
  return { code, backend, routes, ...MetadataService({ request, backend, routes }).fill() };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const metadata = useMetadata(data?.url);

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Referral"}
      description={metadata.find(metadata.wrap(), "description")}>
      <Space size="xl" />
      <Space size="xl" />
      <Space size="xl" />
      <Container>
        <Group size="xl" className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2">
          <Refer url={data.url} />
          <Referral code={data.code ?? undefined} />
        </Group>
      </Container>
    </Hero>
  );
}
