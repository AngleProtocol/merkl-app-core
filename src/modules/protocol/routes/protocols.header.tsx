import { api } from "@core/api";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { Outlet, useLoaderData } from "react-router";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  const { protocols } = await ProtocolService({ api, request, backend }).getManyFromRequest();

  return { protocols, backend, routes, ...MetadataService({ request, backend, routes }).fill() };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  const metadata = useMetadata(url);

  return (
    <Hero
      compact
      icons={[{ remix: "RiVipCrown2Fill", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={I18n.trad.get.pages.protocols.title}
      description={metadata.find(metadata.wrap(), "description")}>
      <Outlet />
    </Hero>
  );
}
