import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    url: `${request.url.split("/")?.[0]}//${request.headers.get("host")}`,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("opportunities", [data?.url]);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={I18n.trad.get.pages.opportunities.title}
      description={MetadataService.getDescription("opportunities", [data?.url])}>
      <Outlet />
    </Hero>
  );
}
