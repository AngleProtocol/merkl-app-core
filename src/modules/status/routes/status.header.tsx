import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ request, backend, routes }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiTimeFill" }]}
      breadcrumbs={[{ link: "/status", name: "status" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Status"}>
      <Outlet />
    </Hero>
  );
}
