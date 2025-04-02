import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import\b.*react-router";
import { Outlet, useLoaderData } from "@remix-run/react";
import Hero from "../../../components/composite/Hero";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ request, backend, routes }).fill();
}
export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const metadata = useMetadata(data?.url);

  return (
    <Hero
      icons={[{ remix: "RiCoinFill" }]}
      title={"Tokens"}
      description={metadata.find(metadata.wrap(), "description")}>
      <Outlet />
    </Hero>
  );
}
