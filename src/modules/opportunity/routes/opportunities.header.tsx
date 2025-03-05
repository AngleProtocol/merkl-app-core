import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return withUrl(request, {});
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrap(data?.url, location.pathname);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <Hero
      // icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={MetadataService.find(MetadataService.wrap(data?.url, location.pathname), "title")}
      description={MetadataService.find(MetadataService.wrap(data?.url, location.pathname), "description")}>
      <Outlet />
    </Hero>
  );
}
