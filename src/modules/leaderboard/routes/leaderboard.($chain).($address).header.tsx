import { type LoaderFunctionArgs, json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { I18n } from "../../../I18n";
import Hero from "../../../components/composite/Hero";
import merklConfig from "../../../config";
import { ChainService } from "../../chain/chain.service";
import { TokenService } from "../../token/token.service";

export const extractChainAndTokenFromParams = async (address: string | undefined, chainName: string | undefined) => {
  if (!chainName && !merklConfig.leaderboard) throw "";
  if (!chainName) chainName = merklConfig.leaderboard!.chain;

  if (!address && !merklConfig.leaderboard) throw "";
  if (!address) address = merklConfig.leaderboard!.address;

  const chain = await ChainService.get({ name: chainName });
  const token = await TokenService.findUniqueOrThrow(chain.id, address);

  return { chain, token };
};

export async function loader({ params: { address, chain: chainName } }: LoaderFunctionArgs) {
  const { chain, token } = await extractChainAndTokenFromParams(address, chainName);

  return json({
    token,
    chain,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data: _data }) => {
  return [{ title: I18n.trad.get.pages.leaderboard.headTitle }];
};

export default function Index() {
  const { token } = useLoaderData<typeof loader>();

  return (
    <Hero
      breadcrumbs={[
        { link: "/tokens", name: "Tokens" },
        { link: `/tokens/${token.symbol}`, name: token.symbol },
      ]}
      icons={[{ src: token.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <>
          {token.name} <span className="font-mono text-main-8">({token.symbol})</span>
        </>
      }
      description={`Leaderboard of all ${token.symbol} rewards earned through Merkl`}>
      <Outlet />
    </Hero>
  );
}
