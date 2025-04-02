import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import\b.*react-router";
import { Outlet } from "@remix-run/react";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ request, backend, routes }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  return (
    <Hero icons={[{ remix: "RiTimeFill" }]} navigation={{ label: "Back to opportunities", link: "/" }} title={"Status"}>
      <Outlet />
    </Hero>
  );
}
