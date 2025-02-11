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

  return MetadataService.wrapMetadata("chains", [data?.url]);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiExchange2Line", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={"Chains"}
      breadcrumbs={[{ link: "/chains", name: "Chains" }]}
      description={MetadataService.getDescription("chains", [data?.url])}>
      <Outlet />
    </Hero>
  );
}
