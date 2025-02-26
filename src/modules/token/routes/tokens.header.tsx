import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Hero from "../../../components/composite/Hero";
import { withUrl } from "../../../utils/url";

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
      icons={[{ remix: "RiCoinFill" }]}
      title={"Tokens"}
      breadcrumbs={[{ link: "/tokens", name: "Tokens" }]}
      description={MetadataService.find(MetadataService.wrap(data?.url, location.pathname), "description")}>
      <Outlet />
    </Hero>
  );
}
