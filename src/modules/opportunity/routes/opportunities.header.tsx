import Hero from "@core/components/composite/Hero";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  return withUrl(request, { backend, routes });
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  console.log(data, error, location);

  return MetadataService({}).fromRoute(data, error, location).wrap();
};

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  const metadata = useMetadata(url);

  return (
    <Hero
      // icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={metadata.find(metadata.wrapInPage(), "title")}
      description={metadata.find(metadata.wrap(), "description")}>
      <Outlet />
    </Hero>
  );
}
