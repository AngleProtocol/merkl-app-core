import Hero from "@core/components/composite/Hero";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return withUrl(request, {});
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrap(data?.url, location.pathname);
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiRefreshFill" }]}
      breadcrumbs={[{ link: "/", name: "status" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Status and Delays"}
      description={""}>
      <Outlet />
    </Hero>
  );
}
