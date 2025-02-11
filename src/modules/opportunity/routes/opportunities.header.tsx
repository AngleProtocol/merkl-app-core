import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c5a01a (add config to wrapMetadata)
import config from "@core/config";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
<<<<<<< HEAD
=======
import { MetadataService } from "@core/modules/metadata/metadata.service";
>>>>>>> 2cbb690 (adjust metadatas)
=======
>>>>>>> 1223716 (change url)
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
<<<<<<< HEAD
<<<<<<< HEAD
  return withUrl(request, {});
=======
  return {
    url: `${request.url.split("/")?.[0]}//${request.headers.get("host")}`,
  };
>>>>>>> 2cbb690 (adjust metadatas)
=======
  return withUrl(request);
>>>>>>> 1223716 (change url)
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

<<<<<<< HEAD
<<<<<<< HEAD
  return MetadataService.wrapMetadata("opportunities", [data?.url, config]);
=======
  return MetadataService.wrapMetadata("opportunities", [data?.url]);
>>>>>>> 2cbb690 (adjust metadatas)
=======
  return MetadataService.wrapMetadata("opportunities", [data?.url, config]);
>>>>>>> 5c5a01a (add config to wrapMetadata)
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={I18n.trad.get.pages.opportunities.title}
<<<<<<< HEAD
<<<<<<< HEAD
      description={MetadataService.getDescription("opportunities", [data?.url, config])}>
=======
      description={MetadataService.getDescription("opportunities", [data?.url])}>
>>>>>>> 2cbb690 (adjust metadatas)
=======
      description={MetadataService.getDescription("opportunities", [data?.url, config])}>
>>>>>>> 5c5a01a (add config to wrapMetadata)
      <Outlet />
    </Hero>
  );
}
