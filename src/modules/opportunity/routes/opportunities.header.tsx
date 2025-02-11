import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
<<<<<<< HEAD
import config from "@core/config";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
=======
import { MetadataService } from "@core/modules/metadata/metadata.service";
>>>>>>> 2cbb690 (adjust metadatas)
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
<<<<<<< HEAD
  return withUrl(request, {});
=======
  return {
    url: `${request.url.split("/")?.[0]}//${request.headers.get("host")}`,
  };
>>>>>>> 2cbb690 (adjust metadatas)
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

<<<<<<< HEAD
  return MetadataService.wrapMetadata("opportunities", [data?.url, config]);
=======
  return MetadataService.wrapMetadata("opportunities", [data?.url]);
>>>>>>> 2cbb690 (adjust metadatas)
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={I18n.trad.get.pages.opportunities.title}
<<<<<<< HEAD
      description={MetadataService.getDescription("opportunities", [data?.url, config])}>
=======
      description={MetadataService.getDescription("opportunities", [data?.url])}>
>>>>>>> 2cbb690 (adjust metadatas)
      <Outlet />
    </Hero>
  );
}
