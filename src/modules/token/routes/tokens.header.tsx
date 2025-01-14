import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";

export const meta: MetaFunction = () => {
  return [{ title: I18n.trad.get.pages.tokens.headTitle }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiCoinFill" }]}
      title={"Tokens"}
      breadcrumbs={[{ link: "/tokens", name: "Tokens" }]}
      description={I18n.trad.get.pages.tokens.description}>
      <Outlet />
    </Hero>
  );
}
