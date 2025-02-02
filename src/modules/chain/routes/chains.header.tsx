import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: I18n.trad.get.pages.chains.headTitle }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiExchange2Line", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={"Chains"}
      breadcrumbs={[{ link: "/chains", name: "Chains" }]}
      description={I18n.trad.get.pages.chains.description}>
      <Outlet />
    </Hero>
  );
}
