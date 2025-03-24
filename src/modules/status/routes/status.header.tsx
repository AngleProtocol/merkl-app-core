import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ request, backend, routes }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiRefreshFill" }]}
      breadcrumbs={[{ link: "/", name: "status" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Status and Delays"}
      description={""}>
      <Outlet />
    </Hero>
  );
}
