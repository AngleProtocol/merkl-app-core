import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Hero from "../../../components/composite/Hero";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return MetadataService({ backend, routes, request }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [_isEditingAddress] = useState(false);

  const metadata = useMetadata(data.url);

  return (
    <Hero
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={metadata.find(metadata.wrapInPage(), "title")}
      description={metadata.find(metadata.wrap(), "description")}>
      <Outlet />
    </Hero>
  );
}
