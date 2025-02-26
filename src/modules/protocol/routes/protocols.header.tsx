import config from "@core/config";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import { withUrl } from "@core/utils/url";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService.getManyFromRequest(request);

  return withUrl(request, { protocols, count });
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  if (!data) return [{ title: error }];

  return MetadataService.wrapMetadata("protocols", [data?.url, config]);
};

export default function Index() {
  return (
    <Hero compact title={I18n.trad.get.pages.protocols.title} breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}>
      <Outlet />
    </Hero>
  );
}
