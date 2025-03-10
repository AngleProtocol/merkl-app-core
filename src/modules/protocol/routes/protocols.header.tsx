import { api } from "@core/api";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

export async function loader({ context: { server }, request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService({ api, request, server }).getManyFromRequest();

  return withUrl(request, { protocols, count });
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrap(data.url, location.pathname);
};

export default function Index() {
  const { count, url } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <Hero
      compact
      icons={[{ remix: "RiCommandLine", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={I18n.trad.get.pages.protocols.title}
      breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}
      description={MetadataService.find(MetadataService.wrap(url, location.pathname), "description")}
      sideDatas={[
        {
          data: count,
          label: "protocols",
          key: uuidv4(),
        },
      ]}>
      <Outlet />
    </Hero>
  );
}
