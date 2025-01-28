import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import Hero from "../../../components/composite/Hero";
import { ProtocolService } from "../../../modules/protocol/protocol.service";

import { Outlet, useLoaderData } from "@remix-run/react";
import { I18n } from "../../../I18n";

export const meta: MetaFunction = () => {
  return [{ title: I18n.trad.get.pages.protocols.headTitle }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService.getManyFromRequest(request);

  return { protocols, count };
}

export default function Index() {
  const { count } = useLoaderData<typeof loader>();

  return (
    <Hero
      compact
      icons={[{ remix: "RiCommandLine", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={I18n.trad.get.pages.protocols.title}
      breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}
      description={I18n.trad.get.pages.protocols.description}
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
