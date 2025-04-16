import type { MerklBackendConfig } from "@core/modules/config/types/merklBackendConfig";
import "react-router";
import type { MerklRoutes } from "@core/modules/config/types/merklRoutesConfig";
import { MerklApi } from "@merkl/api";

const api = MerklApi(
  (typeof window === "undefined" ? process.env.API_URL : (window as { ENV?: { API_URL?: string } })?.ENV?.API_URL) ??
    "https://api.merkl.xyz",
);

export { api };

//TODO: move this in a more appropriate global
declare module "react-router" {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }

  export interface AppLoadContext {
    backend: MerklBackendConfig;
    routes: MerklRoutes;
  }
}
