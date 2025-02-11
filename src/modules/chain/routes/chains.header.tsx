import Hero from "@core/components/composite/Hero";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c5a01a (add config to wrapMetadata)
import config from "@core/config";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
=======
import { MetadataService } from "@core/modules/metadata/metadata.service";
>>>>>>> 2cbb690 (adjust metadatas)
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return withUrl(request, {});
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("chains", [data?.url, config]);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiExchange2Line", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={"Chains"}
      breadcrumbs={[{ link: "/chains", name: "Chains" }]}
      description={MetadataService.getDescription("chains", [data?.url, config])}>
      <Outlet />
    </Hero>
  );
}
