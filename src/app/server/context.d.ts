import type { MerklBackendConfig } from "@core/modules/config/types/merklBackendConfig";
import type { MerklRoutes } from "@core/modules/config/types/merklRoutesConfig";
import "react-router";

export type MerklServerContext = {
  backend: MerklBackendConfig;
  routes: MerklRoutes;
};

declare module "react-router" {
  export interface AppLoadContext {
    backend: MerklServerContext["backend"];
    routes: MerklServerContext["routes"];
  }
}
