import { I18n } from "@core/I18n";
import Hero from "@core/components/composite/Hero";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: I18n.trad.get.pages.home.headTitle }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={I18n.trad.get.pages.opportunities.title}
      description={I18n.trad.get.pages.opportunities.description}>
      <Outlet />
    </Hero>
  );
}
