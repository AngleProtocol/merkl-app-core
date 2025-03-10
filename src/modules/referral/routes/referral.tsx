import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space } from "dappkit";
import Hero from "../../../components/composite/Hero";
import Refer from "../components/Refer";
import Referral from "../components/Referral";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  const code = new URL(request.url).searchParams.get("code");
  return withUrl(request, { code, backend, routes });
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  return MetadataService({}).fromRoute(data, error, location).wrap();
};

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
