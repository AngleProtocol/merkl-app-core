import { api } from "@core/api";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";
import type { MerklBackend } from "@core/config/backend";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService({ api, request, backend }).getManyFromRequest();

  return withUrl(request, { protocols, count, backend, routes });
}

export const meta: MetaFunction<typeof loader> = ({ data, error, location }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  const { url, backend, routes } = data;
  return MetadataService({ url, location, backend: backend as MerklBackend, routes }).wrap();
};

export default function Index() {
  const { count, url } = useLoaderData<typeof loader>();
  const metadata = useMetadata(url);

  return (
    <Hero
      compact
      icons={[{ remix: "RiCommandLine", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={I18n.trad.get.pages.protocols.title}
      breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}
      description={metadata.find(metadata.wrap(), "description")}
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
