import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Hero from "../../../components/composite/Hero";

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    url: `${request.url.split("/")?.[0]}//${request.headers.get("host")}`,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("tokens", [data?.url]);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiCoinFill" }]}
      title={"Tokens"}
      breadcrumbs={[{ link: "/tokens", name: "Tokens" }]}
      description={MetadataService.getDescription("tokens", [data?.url])}>
      <Outlet />
    </Hero>
  );
}
