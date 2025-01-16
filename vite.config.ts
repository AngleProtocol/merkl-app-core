import { vitePlugin as remix } from "@remix-run/dev";
import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    svgr(),
    remix({
      appDirectory: "./src",
      ignoredRouteFiles: ["*"],
      routes(defineRoutes) {
        return defineRoutes(set => {
          function route(
            url: string,
            routeFile: string,
            indexRoute: (routeFile: string) => string,
            subRoutes: [(url: string) => string, (routeFile: string) => string][],
          ) {
            return set(url, `${indexRoute(routeFile)}.tsx`, () => {
              subRoutes.map(([_url, _route]) => set(_url(url), `${_route(routeFile)}.tsx`));
            });
          }

          //Header + Footer on each page
          set(undefined, "layout.tsx", () => {
            route("/", "modules/opportunity/routes/opportunities", file => `${file}.header`, [
              [url => url, file => `${file}.list`],
            ]);

            route(
              "/opportunities/:chain/:type/:id",
              "modules/opportunity/routes/opportunity.$chain.$type.$id",
              file => `${file}.header`,
              [
                [url => url, file => `${file}.campaigns`],
                [url => `${url}/leaderboard`, file => `${file}.leaderboard`],
              ],
            );

            route(
              "/leaderboard/:chain/:address",
              "./packages/merkl-app-core/src/modules/leaderboard/routes/leaderboard.($chain).($address)",
              file => `${file}.header`,
              [[url => `${url}/leaderboard`, file => `${file}.leaderboard`]],
            );

            route("/tokens/:symbol", "modules/token/routes/token.$symbol", tokens => `${tokens}.header`, [
              [tokens => tokens, tokens => `${tokens}.opportunities`],
            ]);

            route("/tokens", "modules/token/routes/tokens", tokens => `${tokens}.header`, [
              [tokens => tokens, tokens => `${tokens}.list`],
            ]);

            route("/chains", "modules/chain/routes/chains", chains => `${chains}.header`, [
              [chains => chains, chains => `${chains}.list`],
            ]);

            route("/chains/:id", "modules/chain/routes/chain.$id", chains => `${chains}.header`, [
              [chains => chains, chains => `${chains}.opportunities`],
            ]);

            route("/protocols", "modules/protocol/routes/protocols", protocols => `${protocols}.header`, [
              [protocols => protocols, protocols => `${protocols}.list`],
            ]);

            route("/protocols/:id", "modules/protocol/routes/protocol.$id", protocol => `${protocol}.header`, [
              [protocol => protocol, protocol => `${protocol}.opportunities`],
            ]);

            route("/users/:address", "modules/user/routes/user.$address", users => `${users}.header`, [
              [users => users, users => `${users}.rewards`],
              [users => `${users}/liquidity`, users => `${users}.liquidity`],
              [users => `${users}/claims`, users => `${users}.claims`],
            ]);

            route(
              "/leaderboard/:chain/:address",
              "modules/leaderboard/routes/leaderboard.$chain.$address",
              leaderboard => `${leaderboard}`,
              [],
            );

            route("/users", "modules/user/routes/user.none", users => `${users}.header`, [
              [users => users, users => `${users}.connect`],
            ]);

            route("/transaction/:name", "modules/interaction/routes/transaction.$name", interaction => interaction, []);

            route("/claim/:address", "modules/claim/routes/claim.$address", claim => claim, []);
          });
        });
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
