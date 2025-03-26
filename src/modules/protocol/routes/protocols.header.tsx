import { api } from "@core/api";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService({ api, request, backend }).getManyFromRequest();

  return { protocols, count, backend, routes, ...MetadataService({ request, backend, routes }).fill() };
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { count, url } = useLoaderData<typeof loader>();
  const metadata = useMetadata(url);

  return (
    <Hero
      compact
      icons={[{ remix: "RiVipCrown2Fill", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={I18n.trad.get.pages.protocols.title}
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
